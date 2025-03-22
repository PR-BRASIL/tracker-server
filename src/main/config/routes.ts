import { Express, Router } from "express";
import { readdirSync } from "fs";
import { join } from "path";

export const setupRoutes = (app: Express): void => {
  const router = Router();
  app.use("/api", router);

  // Carrega manualmente as rotas definidas
  // Ao invés de carregar dinamicamente, vamos importar explicitamente
  try {
    require("../routes/user-routes").default(router);
  } catch (error) {
    console.error("Erro ao carregar rota de usuário:", error);
  }
};
