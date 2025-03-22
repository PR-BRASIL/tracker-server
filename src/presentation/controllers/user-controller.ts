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

      // Calcula a patente com base na pontuação
      const patent = await this.patentCalculator.calculatePatent(
        user.score || 0
      );

      // Calcula o texto de progresso
      const progressText = await this.patentCalculator.calculateProgressText(
        user.score || 0
      );

      // Calcula o rank do usuário
      const userRank = await this.getUserRank(collection, user.hash);

      // Retorna os dados solicitados
      res.status(200).json({
        name: user.name,
        patent,
        text: progressText,
        rank: userRank,
        // Incluímos estatísticas adicionais para referência
        stats: {
          score: user.score || 0,
          kills: user.kills || 0,
          deaths: user.deaths || 0,
          // totalTime: user.totalTime || 0,
        },
      });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
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
}
