import { server } from "./config/app";
import { logger } from "../utils/logger";
import { env } from "./config/env";

server.listen(env.port, () => {
  logger.info("listening on port " + env.port);
});
