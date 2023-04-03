import { config } from "./infrastructure/config";
import { ExpressServer } from "./infrastructure/server/express/server";

const startServer = async (options: typeof config) => {
  const server = await ExpressServer.getInstance(options);
  console.log(`Starting server port:${options.port}`);
};

startServer(config);
