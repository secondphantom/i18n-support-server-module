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
import {
  Sentence,
  SentenceWithKey,
  TranslateJsonValueDto,
  TranslateMultiLanguageDto,
  TranslateReturn,
  TranslateService,
} from "@src/application/service/translate/translate.service";
import { LanguageCodeProxyValidator } from "@src/controller/languageCode/language.code.validator";
import { LanguageCodeValidator } from "../validator/zod/language.code.validator";
import { LanguageCodeController } from "@src/controller/languageCode/language.code.controller";
import {
  LanguageCodeService,
  LanguageCodeSiteMapInputs,
  LanguageCodeSiteMapReturn,
  LanguageCodeWithName,
  LanguageCodeWithOptions,
  MultiLanguageCodeWithOptions,
} from "@src/application/service/languageCode/language.code.service";
import { LocalLanguageCodeNameRepo } from "../db/languageCode/name.repo";
import { LocalLanguageCodeSiteMapRepo } from "../db/languageCode/sitemap.repo";
import { TranslateProxyInterface } from "@src/controller/translate/translate.interface";
import { ResponseDto } from "@src/controller/dto/response.dto";
import { ExpressServer } from "../server/express/server";

export interface ServerOptions {
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

export interface TranslatorOptions {
  translateRepo?: {
    type: TranslateRepoType;
    options?: TranslateRepoOptions;
    launchOptions?: LaunchOptions;
  };
}

export class Translator {
  private options: TranslatorOptions;
  private controller: TranslateProxyValidator | undefined;

  constructor(options?: TranslatorOptions) {
    this.options = {
      translateRepo: {
        type: "google_browser",
        ...options?.translateRepo,
      },
    };
  }

  init = async () => {
    const translateRepo = await TranslateRepoFactory.getInstance(
      this.options.translateRepo!.type as any
    )(
      this.options.translateRepo?.options,
      this.options.translateRepo?.launchOptions
    );
    this.controller = new TranslateProxyValidator(
      new TranslateValidator(),
      new TranslateController(new TranslateService(translateRepo))
    );
  };

  translateSentence = async (dto: Sentence) => {
    const result = await this.controller!.translateSentence(dto);
    return this.responseResolver<LanguageCodeSiteMapReturn>(result);
  };

  translateMultiSentence = async (dto: SentenceWithKey[]) => {
    const result = await this.controller!.translateMultiSentence(dto);
    return this.responseResolver<LanguageCodeSiteMapReturn>(result);
  };

  translateMultiLanguage = async (dto: TranslateMultiLanguageDto) => {
    const result = await this.controller!.translateMultiLanguage(dto);
    return this.responseResolver<LanguageCodeSiteMapReturn>(result);
  };

  translateJsonValue = async (dto: TranslateJsonValueDto) => {
    const result = await this.controller!.translateJsonValue(dto);
    return this.responseResolver<LanguageCodeSiteMapReturn>(result);
  };

  private responseResolver = <T>(responseDto: ResponseDto) => {
    const {
      payload: { data, success },
    } = responseDto;
    if (success) {
      return data as T;
    }
    throw new Error(data.message);
  };
}

export class LanguageCode {
  private controller: LanguageCodeProxyValidator;
  constructor() {
    this.controller = new LanguageCodeProxyValidator(
      new LanguageCodeValidator(),
      new LanguageCodeController(
        new LanguageCodeService(
          new LocalLanguageCodeNameRepo(),
          new LocalLanguageCodeSiteMapRepo()
        )
      )
    );
  }

  getName = async (dto: LanguageCodeWithOptions) => {
    const result = await this.controller.getName(dto);
    return this.responseResolver<LanguageCodeSiteMapReturn>(result);
  };

  getMultiName = async (dto: MultiLanguageCodeWithOptions) => {
    const result = await this.controller.getMultiName(dto);
    return this.responseResolver<LanguageCodeWithName[]>(result);
  };

  getMultiCodeToKeyNameValue = async (dto: MultiLanguageCodeWithOptions) => {
    const result = await this.controller.getMultiCodeToKeyNameValue(dto);
    return this.responseResolver<{
      [x: string]: string;
    }>(result);
  };

  getSiteMap = async (dto: LanguageCodeSiteMapInputs) => {
    const result = await this.controller.getSiteMap(dto);
    return this.responseResolver<LanguageCodeSiteMapReturn>(result);
  };

  private responseResolver = <T>(responseDto: ResponseDto) => {
    const {
      payload: { data, success },
    } = responseDto;
    if (success) {
      return data as T;
    }
    throw new Error(data.message);
  };
}
