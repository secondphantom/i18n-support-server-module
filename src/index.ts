import { LanguageCodeProxyValidator } from "./controller/languageCode/language.code.validator";
import { TranslateProxyValidator } from "./controller/translate/translate.validator";
import {
  i18nSupportServerFactory,
  TranslatorOptions,
  ServerOptions,
  LanguageCode,
  Translator,
} from "./infrastructure/module/index";
import { ExpressServer } from "./infrastructure/server/express/server";

export {
  LanguageCode,
  Translator,
  i18nSupportServerFactory,
  TranslatorOptions as ControllerOptions,
  ServerOptions,
  ExpressServer,
  LanguageCodeProxyValidator,
  TranslateProxyValidator,
};
