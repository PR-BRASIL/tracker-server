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

      // Busca o usuário pelo hash ou nome (insensível a maiúsculas/minúsculas)
      const user = await collection.findOne({
        $or: [
          { hash: query.toString() },
          { name: { $regex: new RegExp(`^${query.toString()}$`, "i") } },
        ],
      });

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

      // Retorna os dados solicitados
      res.status(200).json({
        name: user.name,
        patent,
        text: progressText,
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
}
