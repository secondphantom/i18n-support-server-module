import {
  LanguageCodeService,
  LanguageCodeSiteMapInputs,
} from "../../../../application/service/languageCode/language.code.service";
import { LocalLanguageCodeNameRepo } from "../../../../infrastructure/db/languageCode/name.repo";
import { LocalLanguageCodeSiteMapRepo } from "../../../../infrastructure/db/languageCode/sitemap.repo";

describe("Language Code Name Service Test", () => {
  let languageCodeNameService: LanguageCodeService;
  let languageCodeNameRepo: LocalLanguageCodeNameRepo;
  let languageCodeSiteMapRepo: LocalLanguageCodeSiteMapRepo;

  beforeAll(() => {
    languageCodeNameRepo = LocalLanguageCodeNameRepo.getInstance();
    languageCodeSiteMapRepo = LocalLanguageCodeSiteMapRepo.getInstance();
    languageCodeNameService = LanguageCodeService.getInstance(
      languageCodeNameRepo,
      languageCodeSiteMapRepo
    );
  });

  test("Get Name", async () => {
    const params = {
      code: "ko",
    };

    const result = await languageCodeNameService.getName(params);
    expect(result).toEqual({
      code: "ko",
      name: "Korean",
    });
  });

  test("Get Multiple Name", async () => {
    const params = {
      codeList: ["ko", "en", "ja"],
    };

    const result = await languageCodeNameService.getMultiName(params);

    result.forEach(({ code, name }) => {
      expect(params.codeList.includes(code)).toEqual(true);
      expect(name).toEqual(expect.any(String));
    });
  });

  test("Get Code is Key Value is Name", () => {
    const params = {
      codeList: ["ko", "en", "ja"],
    };

    const result = languageCodeNameService.getMultiCodeToKeyNameValue(params);

    Object.entries(result).forEach(([key, value]) => {
      expect(params.codeList.includes(key)).toEqual(true);
      expect(value).toEqual(expect.any(String));
    });
  });

  test("Get Site Map", () => {
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
