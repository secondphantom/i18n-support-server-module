import "module-alias/register";
import { TranslateRepo } from "@src/application/interfaces/translate.repo";

export interface Sentence {
  sentence: string;
  from: string;
  to: string;
}

export interface SentenceWithKey extends Sentence {
  key: string;
}

export interface TranslateReturn {
  locale: string;
  sentence: string;
}

export interface TranslateReturnWithKey extends TranslateReturn {
  key: string;
}

export interface TranslateMultiLanguageDto {
  sentenceAry: { sentence: string; key: string }[];
  from: string;
  to: string[];
}

export interface TranslateJsonValueDto {
  json: { [key in string]: string };
  from: string;
  to: string[];
}

export class TranslateService {
  static instance: TranslateService | undefined;

  constructor(private translateRepo: TranslateRepo) {}

  static getInstance = (translateRepo: TranslateRepo) => {
    if (this.instance) return this.instance;
    this.instance = new TranslateService(translateRepo);
    return this.instance;
  };

  translateSentence = async (dto: Sentence) => {
    const result: Awaited<ReturnType<typeof this.translateRepo.translate>> = {
      locale: "",
      sentence: "",
    };

    const { locale, sentence } = await this.translateRepo.translate(dto);
    result.locale = locale;
    result.sentence = sentence;

    return result;
  };

  translateMultiSentence = async (
    dto: SentenceWithKey[]
  ): Promise<TranslateReturnWithKey[]> => {
    const resultAry = await this.translateRepo.translateMultiSentence(dto);
    return resultAry;
  };

  translateMultiLanguage = async (
    dto: TranslateMultiLanguageDto
  ): Promise<TranslateReturnWithKey[][]> => {
    return this.translateRepo.translateMultiLanguage(dto);
  };

  translateJsonValue = async (dto: TranslateJsonValueDto) => {
    const { json, from, to } = dto;

    const sentenceAry = this.convertJsonToSentenceAry(json);
    const multiLangResultAry = await this.translateMultiLanguage({
      sentenceAry,
      from,
      to,
    });

    const result = this.convertTranslateReturnAryToJson(multiLangResultAry);
    result[from] = json;
    return result;
  };

  private convertJsonToSentenceAry = (dto: TranslateJsonValueDto["json"]) => {
    return Object.entries(dto).map(([key, value]) => {
      return {
        key,
        sentence: value,
      };
    });
  };

  private convertTranslateReturnAryToJson = (
    dto: TranslateReturnWithKey[][]
  ) => {
    const result: { [key: string]: { [key: string]: string } } = {};

    for (const translateReturnWithKeyAry of dto) {
      translateReturnWithKeyAry.forEach(({ locale, sentence, key }) => {
        if (!result[locale]) {
          result[locale] = {};
        }

        result[locale][key] = sentence;
      });
    }

    return result;
  };
}
