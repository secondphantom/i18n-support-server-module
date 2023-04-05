import { LanguageCodeProxyValidator } from "./controller/languageCode/language.code.validator";
import { TranslateProxyValidator } from "./controller/translate/translate.validator";
import {
  i18nSupportControllerFactory,
  i18nSupportServerFactory,
  ControllerOptions,
  ServerOptions,
} from "./infrastructure/module/index";
import { ExpressServer } from "./infrastructure/server/express/server";

export {
  i18nSupportControllerFactory,
  i18nSupportServerFactory,
  ControllerOptions,
  ServerOptions,
  ExpressServer,
  LanguageCodeProxyValidator,
  TranslateProxyValidator,
};
