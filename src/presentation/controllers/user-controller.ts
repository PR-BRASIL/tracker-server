import { Request, Response } from "express";
import { mongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { PatentCalculator } from "../../utils/patent-calculator";

export class UserController {
  private patentCalculator: PatentCalculator;

  constructor() {
    this.patentCalculator = new PatentCalculator();
  }

  async getUserByHashOrName(req: Request, res: Response): Promise<void> {
    try {
      // Permite consulta via query param ou parâmetro de rota
      const query = req.query.query || req.params.query;

      if (!query) {
        res.status(400).json({ error: "Parâmetro de busca é obrigatório" });
        return;
      }

      const collection = await mongoHelper.getCollection("user");
      const monthlyCollection = await mongoHelper.getCollection("monthly_user");
      const searchQuery = query.toString();

      // Usando regex mais flexível, similar ao MongoSaveUserDataRepository
      const regex = new RegExp(searchQuery, "i");

      // Primeiro, tenta buscar todos que correspondem ao padrão (nome ou hash)
      const users = await collection
        .find({
          $or: [{ name: regex }, { hash: searchQuery }],
        })
        .toArray();

      let user = null;

      // Se encontrou exatamente um usuário, use-o
      if (users.length === 1) {
        user = users[0];
      }
      // Se encontrou vários, procura pela correspondência exata de nome
      else if (users.length > 1) {
        user = users.find(
          (u) => searchQuery.toLowerCase() === u.name.toLowerCase()
        );

        // Se não encontrou por nome exato, usa o primeiro resultado
        if (!user) {
          user = users[0];
        }
      }
      // Caso não tenha encontrado nenhum, tenta buscar especificamente pelo hash
      else {
        user = await collection.findOne({ hash: searchQuery });
      }

      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }

      // Busca dados mensais do usuário
      const monthlyUser = await monthlyCollection.findOne({
        hash: user.hash,
      });

      // Calcula a patente com base na pontuação
      const patent = await this.patentCalculator.calculatePatent(
        user.score || 0
      );

      // Obtém o nome da patente com a abordagem semelhante à outra aplicação
      const patentName = (await this.getPatentName(user.score || 0)).split(
        " <"
      )[0];

      // Calcula o texto de progresso
      const progressText = await this.patentCalculator.calculateProgressText(
        user.score || 0
      );

      // Calcula o rank do usuário
      const userRank = await this.getUserRank(collection, user.hash);

      // Calcula informações mensais
      let monthlyData = null;
      if (monthlyUser) {
        const monthlyPatent = await this.patentCalculator.calculatePatent(
          monthlyUser.score || 0
        );
        const monthlyPatentName = (
          await this.getPatentName(monthlyUser.score || 0)
        ).split(" <")[0];
        const monthlyRank = await this.getUserRank(
          monthlyCollection,
          user.hash
        );

        monthlyData = {
          score: monthlyUser.score || 0,
          kills: monthlyUser.kills || 0,
          deaths: monthlyUser.deaths || 0,
          patent: monthlyPatent,
          patentName: monthlyPatentName,
          rank: monthlyRank,
        };
      }

      // Retorna os dados solicitados
      res.status(200).json({
        name: user.name,
        patent,
        patentName,
        text: progressText,
        rank: userRank,
        // Incluímos estatísticas adicionais para referência
        stats: {
          score: user.score || 0,
          kills: user.kills || 0,
          deaths: user.deaths || 0,
          // totalTime: user.totalTime || 0,
        },
        monthly: monthlyData,
        discordId: user.discordUserId || null,
      });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  /**
   * Obtém o nome da patente usando abordagem similar à outra aplicação do usuário
   */
  private async getPatentName(score: number): Promise<string> {
    try {
      const collection = await mongoHelper.getCollection("patents");
      const patents = await collection
        .find<{ text: string; score: number }>({})
        .toArray();

      if (!patents || patents.length === 0) {
        // Fallback para o método existente se não encontrar patentes
        return this.patentCalculator.calculatePatent(score);
      }

      const patentsWithSort = patents.sort((a, b) => a.score - b.score);
      const patentIndex = patentsWithSort.findIndex((p) => p.score > score) - 1;

      // Se não encontrou um índice válido ou findIndex retornou -1
      if (patentIndex < 0 || patentIndex >= patentsWithSort.length) {
        // Retorna a maior patente disponível
        return patents[patents.length - 1].text;
      }

      return patentsWithSort[patentIndex].text;
    } catch (error) {
      console.error("Erro ao obter nome da patente:", error);
      // Fallback para o método existente
      return this.patentCalculator.calculatePatent(score);
    }
  }

  /**
   * Calcula o rank do usuário com base no score
   */
  private async getUserRank(
    collection: any,
    userHash: string
  ): Promise<number> {
    const result = await collection.find({}).sort({ score: -1 }).toArray();

    return result.findIndex((user: any) => user.hash === userHash) + 1;
  }

  /**
   * Retorna os 3 primeiros colocados do ranking mensal
   */
  async getMonthlyTopThree(req: Request, res: Response): Promise<void> {
    try {
      const collection = await mongoHelper.getCollection("monthly_user");

      // Busca os 3 primeiros jogadores ordenados por score
      const topPlayers = await collection
        .find({})
        .sort({ score: -1 })
        .limit(3)
        .toArray();

      if (!topPlayers || topPlayers.length === 0) {
        res.status(404).json({ error: "Nenhum jogador encontrado" });
        return;
      }

      // Formata os dados dos top 3 jogadores
      const formattedPlayers = await Promise.all(
        topPlayers.map(async (player, index) => {
          const patent = await this.patentCalculator.calculatePatent(
            player.score || 0
          );
          const patentName = (
            await this.getPatentName(player.score || 0)
          ).split(" <")[0];

          return {
            position: index + 1,
            name: player.name,
            hash: player.hash,
            score: player.score || 0,
            kills: player.kills || 0,
            deaths: player.deaths || 0,
            patent,
            patentName,
          };
        })
      );

      res.status(200).json({
        month: new Date().toLocaleString("pt-BR", {
          month: "long",
          year: "numeric",
        }),
        topPlayers: formattedPlayers,
      });
    } catch (error) {
      console.error("Erro ao buscar top 3 jogadores mensais:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
