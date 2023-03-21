import {
  Sentence,
  SentenceWithKey,
  TranslateJsonValueDto,
  TranslateMultiLanguageDto,
} from "@src/application/service/translate/translate.service";
import { ResponseDto } from "../dto/response.dto";

export interface TranslateProxyInterface {
  translateSentence: (dto: Sentence) => Promise<ResponseDto>;

  translateMultiSentence: (dto: SentenceWithKey[]) => Promise<ResponseDto>;

  translateMultiLanguage: (
    dto: TranslateMultiLanguageDto
  ) => Promise<ResponseDto>;

  translateJsonValue: (dto: TranslateJsonValueDto) => Promise<ResponseDto>;
}

export interface TranslateValidatorInterface {
  translateSentence: (dto: Sentence) => void;

  translateMultiSentence: (dto: SentenceWithKey[]) => void;

  translateMultiLanguage: (dto: TranslateMultiLanguageDto) => void;

  translateJsonValue: (dto: TranslateJsonValueDto) => void;
}
