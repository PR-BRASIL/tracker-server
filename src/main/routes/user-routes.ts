import { Router } from "express";
import { UserController } from "../../presentation/controllers/user-controller";

export default (router: Router): void => {
  const userController = new UserController();

  // Rota para consulta via query param (/api/user?query=valor)
  router.get("/user", (req, res) =>
    userController.getUserByHashOrName(req, res)
  );

  // Rota alternativa para consulta via parâmetro de URL (/api/user/valor)
  router.get("/user/:query", (req, res) =>
    userController.getUserByHashOrName(req, res)
  );

  // Rota para obter os 3 primeiros colocados do ranking mensal
  router.get("/monthly-top-players", (req, res) =>
    userController.getMonthlyTopThree(req, res)
  );
};
