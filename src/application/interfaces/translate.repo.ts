import {
  Sentence,
  SentenceWithKey,
  TranslateMultiLanguageDto,
  TranslateReturn,
  TranslateReturnWithKey,
} from "../service/translate/translate.service";

export abstract class TranslateRepo {
  translate = async (dao: Sentence): Promise<TranslateReturn> => ({
    locale: "temp",
    sentence: "temp",
  });

  translateMultiSentence = async (
    daoAry: SentenceWithKey[]
  ): Promise<TranslateReturnWithKey[]> => {
    const promiseAry = daoAry.map<Promise<TranslateReturnWithKey>>(
      ({ key, ...res }) => {
        return new Promise(async (resolve, reject) => {
          const result = await this.translate(res).then((res) => ({
            key,
            ...res,
          }));
          resolve(result);
        });
      }
    );
    const resultAry = await Promise.all(promiseAry);
    return resultAry;
  };

  translateMultiLanguage = async (
    dao: TranslateMultiLanguageDto
  ): Promise<TranslateReturnWithKey[][]> => {
    const { sentenceAry, from, to } = dao;

    const promiseAry = to.map<Promise<TranslateReturnWithKey[]>>((locale) => {
      return new Promise(async (resolve, reject) => {
        const input = sentenceAry.map(({ sentence, key }) => ({
          key,
          sentence,
          from,
          to: locale,
        }));
        const result = await this.translateMultiSentence(input);
        resolve(result);
      });
    });
    const multiSentenceResultAry = await Promise.all(promiseAry);

    return multiSentenceResultAry;
  };
}
