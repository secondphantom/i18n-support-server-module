import { LaunchOptions } from "playwright";
import { TranslateRepoOptions } from "../db/translate/google_browser/translate.repo";
import {
  TranslateRepoFactory,
  TranslateRepoType,
} from "../db/translate/translate.repo.factory";
import { ServerFactory, ServerType } from "../server/server.factory";
import { TranslateProxyValidator } from "@src/controller/translate/translate.validator";
import { TranslateValidator } from "../validator/zod/translate.validator";
import { TranslateController } from "@src/controller/translate/translate.controller";
import { TranslateService } from "@src/application/service/translate/translate.service";
import { LanguageCodeProxyValidator } from "@src/controller/languageCode/language.code.validator";
import { LanguageCodeValidator } from "../validator/zod/language.code.validator";
import { LanguageCodeController } from "@src/controller/languageCode/language.code.controller";
import { LanguageCodeService } from "@src/application/service/languageCode/language.code.service";
import { LocalLanguageCodeNameRepo } from "../db/languageCode/name.repo";
import { LocalLanguageCodeSiteMapRepo } from "../db/languageCode/sitemap.repo";
import { TranslateProxyInterface } from "@src/controller/translate/translate.interface";
import { ResponseDto } from "@src/controller/dto/response.dto";

interface ServerOptions {
  translateRepo?: {
    type: TranslateRepoType;
    options?: TranslateRepoOptions;
    launchOptions?: LaunchOptions;
  };
  serverOptions?: {
    cors: {
      allowedOrigin: string;
    };
    port: number;
  };
}

export const i18nSupportServerFactory = async (
  type: ServerType,
  options?: ServerOptions
) => {
  options = {
    translateRepo: {
      type: "google_browser",
      ...options?.translateRepo,
    },
    serverOptions: {
      cors: {
        allowedOrigin: "*",
      },
      port: 3000,
      ...options?.serverOptions,
    },
  };

  const translateRepo = await TranslateRepoFactory.getInstance(
    options.translateRepo!.type
  )(options.translateRepo?.options, options.translateRepo?.launchOptions);

  const server = await ServerFactory.getInstance(type)(
    { translateRepo: translateRepo },
    options.serverOptions as any
  );

  console.info(`Server Started PORT:${options.serverOptions?.port}`);
  return server;
};

interface ControllerOptions {
  translateRepo?: {
    type: TranslateRepoType;
    options?: TranslateRepoOptions;
    launchOptions?: LaunchOptions;
  };
}

const responseResolver = <T>(controller: {
  [key in string]: any;
}) => {
  const newController: { [key in string]: (...args: any[]) => any } = {};
  Object.entries(controller).forEach(([key, value]) => {
    if (typeof value !== "function") {
      newController[key] = value;
      return;
    }
    newController[key] = async (...args: any[]) => {
      return value(...args).then((response: ResponseDto) => {
        if (response.status !== 200) {
          throw new Error(response.payload.data.message);
        }
        return response.payload.data;
      });
    };
    return;
  });
  return newController as T;
};

export const i18nSupportControllerFactory = async <
  T extends LanguageCodeProxyValidator | TranslateProxyValidator
>(
  type: T extends LanguageCodeProxyValidator ? "language-code" : "translate",
  options?: ControllerOptions
): Promise<T> => {
  options = {
    translateRepo: {
      type: "google_browser",
      ...options?.translateRepo,
    },
  };

  switch (type) {
    case "translate":
      const translateRepo = await TranslateRepoFactory.getInstance(
        options.translateRepo!.type
      )(options.translateRepo?.options, options.translateRepo?.launchOptions);

      return responseResolver<T>(
        TranslateProxyValidator.getInstance(
          TranslateValidator.getInstance(),
          TranslateController.getInstance(
            TranslateService.getInstance(translateRepo)
          )
        )
      );

    case "language-code":
      return responseResolver<T>(
        LanguageCodeProxyValidator.getInstance(
          LanguageCodeValidator.getInstance(),
          LanguageCodeController.getInstance(
            LanguageCodeService.getInstance(
              LocalLanguageCodeNameRepo.getInstance(),
              LocalLanguageCodeSiteMapRepo.getInstance()
            )
          )
        )
      );

    default:
      throw new Error("Need Controller Type Input");
  }
};
