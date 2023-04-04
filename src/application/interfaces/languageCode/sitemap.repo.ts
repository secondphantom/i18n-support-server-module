import {
  LanguageCodeSiteMapInputs,
  LanguageCodeSiteMapReturn,
} from "@src/application/service/languageCode/language.code.service";

export abstract class LanguageCodeSitemapRepo {
  abstract getSiteMap: (
    dao: LanguageCodeSiteMapInputs
  ) => LanguageCodeSiteMapReturn;
}
