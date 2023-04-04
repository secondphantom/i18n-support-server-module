import {
  LanguageCodeWithOptions,
  LanguageCodeWithName,
  MultiLanguageCodeWithOptions,
  LanguageCodeKeyWithName,
  LanguageCodeSiteMapInputs,
  LanguageCodeSiteMapReturn,
  LanguageCodeService,
} from "@src/application/service/languageCode/language.code.service";
import { LanguageCodeProxyInterface } from "./language.code.interface";
import { ResponseDto } from "../dto/response.dto";

export class LanguageCodeController implements LanguageCodeProxyInterface {
  static instance: LanguageCodeController | undefined;

  constructor(private languageCodeService: LanguageCodeService) {}

  static getInstance = (languageCodeService: LanguageCodeService) => {
    if (this.instance) return this.instance;
    this.instance = new LanguageCodeController(languageCodeService);
    return this.instance;
  };

  getName = async (dto: LanguageCodeWithOptions) => {
    try {
      const result = await this.languageCodeService.getName(dto);
      return new ResponseDto<typeof result>({
        status: 200,
        payload: { success: true, data: result },
      });
    } catch (error) {
      return new ResponseDto({
        status: 400,
        payload: {
          success: false,
          data: {
            message: "Bad Request",
          },
        },
      });
    }
  };

  getMultiName = async (dto: MultiLanguageCodeWithOptions) => {
    try {
      const result = await this.languageCodeService.getMultiName(dto);
      return new ResponseDto<typeof result>({
        status: 200,
        payload: { success: true, data: result },
      });
    } catch (error) {
      return new ResponseDto({
        status: 400,
        payload: {
          success: false,
          data: {
            message: "Bad Request",
          },
        },
      });
    }
  };
  getMultiCodeToKeyNameValue = async (dto: MultiLanguageCodeWithOptions) => {
    try {
      const result = await this.languageCodeService.getMultiCodeToKeyNameValue(
        dto
      );
      return new ResponseDto<typeof result>({
        status: 200,
        payload: { success: true, data: result },
      });
    } catch (error) {
      return new ResponseDto({
        status: 400,
        payload: {
          success: false,
          data: {
            message: "Bad Request",
          },
        },
      });
    }
  };

  getSiteMap = async (dto: LanguageCodeSiteMapInputs) => {
    try {
      const result = await this.languageCodeService.getSiteMap(dto);
      return new ResponseDto<typeof result>({
        status: 200,
        payload: { success: true, data: result },
      });
    } catch (error) {
      return new ResponseDto({
        status: 400,
        payload: {
          success: false,
          data: {
            message: "Bad Request",
          },
        },
      });
    }
  };
}
