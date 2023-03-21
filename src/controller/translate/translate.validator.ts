import {
  Sentence,
  SentenceWithKey,
  TranslateMultiLanguageDto,
  TranslateJsonValueDto,
} from "@src/application/service/translate/translate.service";
import { ResponseDto } from "../dto/response.dto";
import { TranslateController } from "./translate.controller";
import {
  TranslateForwardProxyInterface,
  TranslateValidatorInterface,
} from "../interface/translate.interface";

export class TranslateValidator implements TranslateForwardProxyInterface {
  static instance: TranslateValidator | undefined;

  constructor(
    private translateValidator: TranslateValidatorInterface,
    private translateController: TranslateForwardProxyInterface
  ) {}

  static getInstance = async (
    translateValidator: TranslateValidatorInterface,
    translateController: TranslateForwardProxyInterface
  ) => {
    if (this.instance) return this.instance;
    this.instance = new TranslateValidator(
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
