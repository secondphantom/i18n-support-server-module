import {
  Sentence,
  SentenceWithKey,
  TranslateMultiLanguageDto,
  TranslateJsonValueDto,
} from "@src/application/service/translate/translate.service";
import { ResponseDto } from "../dto/response.dto";
import { TranslateController } from "./translate.controller";
import {
  TranslateProxyInterface,
  TranslateValidatorInterface,
} from "./translate.interface";

export class TranslateProxyValidator implements TranslateProxyInterface {
  static instance: TranslateProxyValidator | undefined;

  constructor(
    private translateValidator: TranslateValidatorInterface,
    private translateController: TranslateProxyInterface
  ) {}

  static getInstance = (
    translateValidator: TranslateValidatorInterface,
    translateController: TranslateProxyInterface
  ) => {
    if (this.instance) return this.instance;
    this.instance = new TranslateProxyValidator(
      translateValidator,
      translateController
    );
    return this.instance;
  };

  translateSentence = async (dto: Sentence) => {
    try {
      await this.translateValidator.translateSentence(dto);
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
    return this.translateController.translateSentence(dto);
  };

  translateMultiSentence = async (dto: SentenceWithKey[]) => {
    try {
      await this.translateValidator.translateMultiSentence(dto);
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
    return this.translateController.translateMultiSentence(dto);
  };

  translateMultiLanguage = async (dto: TranslateMultiLanguageDto) => {
    try {
      await this.translateValidator.translateMultiLanguage(dto);
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
    return this.translateController.translateMultiLanguage(dto);
  };

  translateJsonValue = async (dto: TranslateJsonValueDto) => {
    try {
      await this.translateValidator.translateJsonValue(dto);
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
    return this.translateController.translateJsonValue(dto);
  };
}
