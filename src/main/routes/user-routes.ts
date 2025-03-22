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
};
