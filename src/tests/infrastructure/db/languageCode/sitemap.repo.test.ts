import { LanguageCodeSiteMapInputs } from "../../../../application/service/languageCode/language.code.service";
import { LocalLanguageCodeSiteMapRepo } from "../../../../infrastructure/db/languageCode/sitemap.repo";

describe("LocalLanguageCodeSiteMapRepo Sitemap Repo Test", () => {
  let languageCodeSiteMapRepo: LocalLanguageCodeSiteMapRepo;

  beforeAll(() => {
    languageCodeSiteMapRepo = LocalLanguageCodeSiteMapRepo.getInstance();
  });

  test("Get SiteMap", () => {
    const params: LanguageCodeSiteMapInputs = {
      rootUrl: "http://localhost:3031",
      pages: ["/"],
      defaultLocale: "ko",
      supportedLocales: ["en", "ja"],
    };

    const { siteMap } = languageCodeSiteMapRepo.getSiteMap(params);

    expect(siteMap).toEqual(expect.any(String));
  });
});
