import { config } from "./infrastructure/config";
import { GoogleTranslateRepo } from "./infrastructure/db/translate/google_browser/translate.repo";
import { ServerFactory } from "./infrastructure/server/server.factory";

const startServer = async (options: typeof config) => {
  const googleTranslateRepo = await GoogleTranslateRepo.getInstance();

  const server = await ServerFactory.getInstance("express")(
    { translateRepo: googleTranslateRepo },
    options
  );

  console.log(`Starting server port:${options.port}`);
};

startServer(config);
