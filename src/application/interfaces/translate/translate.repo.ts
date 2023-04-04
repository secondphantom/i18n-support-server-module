import {
  Sentence,
  SentenceWithKey,
  TranslateMultiLanguageDto,
  TranslateReturn,
  TranslateReturnWithKey,
} from "../../service/translate/translate.service";

export abstract class TranslateRepo {
  abstract translate: (dao: Sentence) => Promise<TranslateReturn>;

  abstract translateMultiSentence: (
    daoAry: SentenceWithKey[]
  ) => Promise<TranslateReturnWithKey[]>;

  abstract translateMultiLanguage: (
    dao: TranslateMultiLanguageDto
  ) => Promise<TranslateReturnWithKey[][]>;
}
