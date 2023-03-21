import {
  Sentence,
  SentenceWithKey,
  TranslateJsonValueDto,
  TranslateMultiLanguageDto,
  TranslateService,
} from "@src/application/service/translate/translate.service";
import { ResponseDto } from "../dto/response.dto";
import { TranslateForwardProxyInterface } from "../interface/translate.interface";

export class TranslateController implements TranslateForwardProxyInterface {
  static instance: TranslateController | undefined;

  constructor(private translateService: TranslateService) {}

  static getInstance = async (translateService: TranslateService) => {
    if (this.instance) return this.instance;
    this.instance = new TranslateController(translateService);
    return this.instance;
  };

  translateSentence = async (dto: Sentence) => {
    try {
      const result = await this.translateService.translateSentence(dto);
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

  translateMultiSentence = async (dto: SentenceWithKey[]) => {
    try {
      const result = await this.translateService.translateMultiSentence(dto);
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

  translateMultiLanguage = async (dto: TranslateMultiLanguageDto) => {
    try {
      const result = await this.translateService.translateMultiLanguage(dto);
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

  translateJsonValue = async (dto: TranslateJsonValueDto) => {
    try {
      const result = await this.translateService.translateJsonValue(dto);
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
