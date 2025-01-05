import { startServer } from "./book";

interface ServerConfig {
  host: string;
  port: number;
}

const config: ServerConfig = {
  host: "127.0.0.1",
  port: 4000,
};

startServer(config);
