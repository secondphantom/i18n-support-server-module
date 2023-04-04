import {
  LanguageCodeSiteMapInputs,
  LanguageCodeSiteMapReturn,
} from "@src/application/service/languageCode/language.code.service";

export abstract class LanguageCodeSitemapRepo {
  getSiteMap = (
    dao: LanguageCodeSiteMapInputs
  ): Promise<LanguageCodeSiteMapReturn> | LanguageCodeSiteMapReturn => ({
    siteMap: "str",
  });
}
