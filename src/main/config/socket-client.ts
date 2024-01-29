import { io } from "socket.io-client";
import { env } from "./env";

export const socketClient = io(env.apiUrl);
