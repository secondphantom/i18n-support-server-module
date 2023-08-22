import {
  LanguageCodeWithOptions,
  MultiLanguageCodeWithOptions,
  LanguageCodeSiteMapInputs,
} from "@src/application/service/languageCode/language.code.service";
import { ResponseDto } from "../dto/response.dto";
import { LanguageCodeProxyInterface } from "./language.code.interface";
import { LanguageCodeValidatorInterface } from "./language.code.interface";

export class LanguageCodeProxyValidator implements LanguageCodeProxyInterface {
  static instance: LanguageCodeProxyValidator | undefined;

  constructor(
    private languageCodeValidator: LanguageCodeValidatorInterface,
    private languageCodeController: LanguageCodeProxyInterface
  ) {}

  static getInstance = (
    languageCodeValidator: LanguageCodeValidatorInterface,
    languageCodeController: LanguageCodeProxyInterface
  ) => {
    if (this.instance) return this.instance;
    this.instance = new LanguageCodeProxyValidator(
      languageCodeValidator,
      languageCodeController
    );
    return this.instance;
  };

  getName = async (dto: LanguageCodeWithOptions) => {
    try {
      await this.languageCodeValidator.getName(dto);
    } catch (error) {
      return new ResponseDto({
        status: 400,
        payload: {
          success: false,
          data: {
            message: "Invalid Input",
          },
        },
      });
    }
    return this.languageCodeController.getName(dto);
  };

  getMultiName = async (dto: MultiLanguageCodeWithOptions) => {
    try {
      await this.languageCodeValidator.getMultiName(dto);
    } catch (error) {
      return new ResponseDto({
        status: 400,
        payload: {
          success: false,
          data: {
            message: "Invalid Input",
          },
        },
      });
    }
    return this.languageCodeController.getMultiName(dto);
  };

  getMultiCodeToKeyNameValue = async (dto: MultiLanguageCodeWithOptions) => {
    try {
      await this.languageCodeValidator.getMultiCodeToKeyNameValue(dto);
    } catch (error) {
      return new ResponseDto({
        status: 400,
        payload: {
          success: false,
          data: {
            message: "Invalid Input",
          },
        },
      });
    }
    return this.languageCodeController.getMultiCodeToKeyNameValue(dto);
  };

  getSiteMap = async (dto: LanguageCodeSiteMapInputs) => {
    try {
      this.languageCodeValidator.getSiteMap(dto);
    } catch (error) {
      console.log(error);
      return new ResponseDto({
        status: 400,
        payload: {
          success: false,
          data: {
            message: "Invalid Input",
          },
        },
      });
    }
    return this.languageCodeController.getSiteMap(dto);
  };
}
