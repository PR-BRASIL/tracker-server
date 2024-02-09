import { server } from "./config/app";
import { logger } from "../utils/logger";
import { env } from "./config/env";
import { mongoHelper } from "../infra/db/mongodb/helpers/mongo-helper";

server.listen(env.port, async () => {
  let mongoConectionCheck = true;

  await mongoHelper
    .connect(env.mongoUrl)
    .then(() => logger.info("mongoDB started"))
    .catch((err) => {
      logger.error(err);
      mongoConectionCheck = false;
    });

  if (!mongoConectionCheck) return logger.fatal("Error in Mongodb connection");

  logger.info("listening on port " + env.port);
});
