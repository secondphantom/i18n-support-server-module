import { LocalLanguageCodeNameRepo } from "../../../../infrastructure/db/languageCode/name.repo";
import { LanguageCodeWithName } from "../../../../application/service/languageCode/language.code.service";

describe("Local Locale Name Repo Test", () => {
  let languageCodeRepo: LocalLanguageCodeNameRepo;

  beforeAll(() => {
    languageCodeRepo = LocalLanguageCodeNameRepo.getInstance();
  });

  test("Get Name", () => {
    const params = {
      code: "ko",
    };

    const result = languageCodeRepo.getName(params) as LanguageCodeWithName;

    expect(result).toEqual({
      code: "ko",
      name: "Korean",
    });
  });

  test("Invalid Input", () => {
    const params = {
      code: "s2",
    };

    try {
      const result = languageCodeRepo.getName(params) as LanguageCodeWithName;
    } catch (error) {
      expect(error).toEqual(expect.anything());
    }
  });

  test("Get Multiple Name", () => {
    const params = {
      codeList: ["ko", "en", "ja"],
    };

    const result = languageCodeRepo.getMultiName(
      params
    ) as LanguageCodeWithName[];

    result.forEach(({ code, name }) => {
      expect(params.codeList.includes(code)).toEqual(true);
      expect(name).toEqual(expect.any(String));
    });
  });
});
