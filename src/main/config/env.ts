/* eslint-disable @typescript-eslint/no-magic-numbers */
import { config } from "dotenv";

config();

export const env = {
  apiUrl: process.env.BOT_URL || "http://localhost:7070",
  port: process.env.PORT || 8080,
  key: process.env.KEY,
  cert: process.env.CERT,
  mongoUrl: process.env.MONGO_URL || "mongodb://0.0.0.0:27017/tracker-server",
};
