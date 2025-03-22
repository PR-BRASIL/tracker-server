import express from "express";
import https from "https";
import { Server } from "socket.io";
import { makeEvents } from "./events";
import { env } from "./env";
import http from "http";
import fs from "fs";
import { rateLimitMiddleware } from "../middlewares/rate-limit";
import { setupRoutes } from "./routes";

const app = express();
app.use(rateLimitMiddleware);
app.use(express.json());
// Configura as rotas
setupRoutes(app);

let server: any;

if (env.cert && env.key) {
  server = https.createServer(
    {
      cert: fs.readFileSync(env.cert),
      key: fs.readFileSync(env.key),
    },
    app
  );
} else {
  server = http.createServer(app);
}

export const io = new Server(server);
makeEvents(io);

export { server, app };
