import {
  LanguageCodeWithOptions,
  LanguageCodeWithName,
  MultiLanguageCodeWithOptions,
  LanguageCodeKeyWithName,
} from "@src/application/service/languageCode/language.code.service";

export abstract class LanguageCodeNameRepo {
  getName = (
    dao: LanguageCodeWithOptions
  ): Promise<LanguageCodeWithName> | LanguageCodeWithName => ({
    code: "str",
    name: "str",
  });

  getMultiName = (
    dao: MultiLanguageCodeWithOptions
  ): Promise<LanguageCodeWithName[]> | LanguageCodeWithName[] => [
    {
      code: "temp",
      name: "temp",
    },
  ];
}
