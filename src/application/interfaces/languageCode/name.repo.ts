import {
  LanguageCodeWithOptions,
  LanguageCodeWithName,
  MultiLanguageCodeWithOptions,
  LanguageCodeKeyWithName,
} from "@src/application/service/languageCode/language.code.service";

export abstract class LanguageCodeNameRepo {
  abstract getName: (dao: LanguageCodeWithOptions) => LanguageCodeWithName;

  abstract getMultiName: (
    dao: MultiLanguageCodeWithOptions
  ) => LanguageCodeWithName[];
}
