import {
  LanguageCodeKeyWithName,
  LanguageCodeSiteMapInputs,
  LanguageCodeSiteMapReturn,
  LanguageCodeWithName,
  LanguageCodeWithOptions,
  MultiLanguageCodeWithOptions,
} from "@src/application/service/languageCode/language.code.service";
import { ResponseDto } from "../dto/response.dto";

export interface LanguageCodeProxyInterface {
  getName: (dto: LanguageCodeWithOptions) => Promise<ResponseDto>;

  getMultiName: (dto: MultiLanguageCodeWithOptions) => Promise<ResponseDto>;

  getMultiCodeToKeyNameValue: (
    dto: MultiLanguageCodeWithOptions
  ) => Promise<ResponseDto>;

  getSiteMap: (dto: LanguageCodeSiteMapInputs) => Promise<ResponseDto>;
}

export interface LanguageCodeValidatorInterface {
  getName: (dto: LanguageCodeWithOptions) => void;

  getMultiName: (dto: MultiLanguageCodeWithOptions) => void;

  getMultiCodeToKeyNameValue: (dto: MultiLanguageCodeWithOptions) => void;

  getSiteMap: (dto: LanguageCodeSiteMapInputs) => void;
}
