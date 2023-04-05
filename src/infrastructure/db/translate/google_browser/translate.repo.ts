import "module-alias/register";
import { TranslateRepo } from "@src/application/interfaces/translate/translate.repo";
import {
  Sentence,
  SentenceWithKey,
  TranslateMultiLanguageDto,
  TranslateReturn,
  TranslateReturnWithKey,
} from "@src/application/service/translate/translate.service";
import {
  Browser,
  BrowserContext,
  chromium,
  LaunchOptions,
  Page,
} from "playwright";

export interface TranslateRepoOptions {
  concurrency: number;
  lockDelayMs?: number;
}

interface PageWithLock {
  isLocked: boolean;
  index: number;
  page: Page | undefined;
}

export class GoogleTranslateRepo extends TranslateRepo {
  static instance: GoogleTranslateRepo | undefined;
  private pageWithLockAry: PageWithLock[] = [];

  private browser: Browser | undefined;
  private context: BrowserContext | undefined;
  private URL = "https://translate.google.co.kr/?hl=en";

  constructor(
    private options?: TranslateRepoOptions,
    private launchOptions?: LaunchOptions
  ) {
    super();

    this.options = {
      concurrency: 1,
      lockDelayMs: 15000,
      ...options,
    };
    this.pageWithLockAry = Array.from(
      { length: this.options.concurrency },
      (_, index) => ({ isLocked: false, index, page: undefined })
    );
  }

  static getInstance = async (
    options?: TranslateRepoOptions,
    launchOptions?: LaunchOptions
  ) => {
    if (this.instance) return this.instance;
    this.instance = new GoogleTranslateRepo(options, launchOptions);
    await this.instance.init();
    return this.instance;
  };

  private init = async () => {
    this.browser = await chromium.launch(this.launchOptions);
    this.context = await this.browser.newContext();

    for (const { index } of this.pageWithLockAry) {
      this.pageWithLockAry[index].page = await this.context.newPage();
    }
  };

  close = async () => {
    await this.browser?.close();
  };

  private getPage = async () => {
    let pageWithLock: PageWithLock;
    while (true) {
      const validPages = this.pageWithLockAry.filter(
        ({ isLocked }) => !isLocked
      );
      if (validPages.length !== 0) {
        pageWithLock = validPages[0];
        pageWithLock.isLocked = true;
        break;
      }
      await this.delay();
    }
    return pageWithLock;
  };

  private delay = () => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(null);
      }, this.options?.lockDelayMs);
    });
  };

  translate = async (dao: Sentence): Promise<TranslateReturn> => {
    try {
      const page = await this.getPage();
      await this.setUrl(dao, page);
      const result = await this.getResult(page);
      page.isLocked = false;
      return {
        locale: dao.to,
        sentence: result,
      };
    } catch (error) {
      return {
        locale: dao.to,
        sentence: "Error",
      };
    }
  };

  private setUrl = async (
    { sentence, from, to }: Sentence,
    pageWithLock: PageWithLock
  ) => {
    const encodeStr = encodeURI(sentence);
    const url = `${this.URL}&sl=${from}&tl=${to}&text=${encodeStr}&op=translate`;
    await pageWithLock.page?.goto(url, { waitUntil: "networkidle" });
  };

  private getResult = async (pageWithLock: PageWithLock) => {
    const result = await (
      await (await pageWithLock.page?.$("div[aria-live='polite']"))?.$("span")
    )?.innerText();
    if (result === undefined) {
      throw new Error("Fail to translate");
    }
    return result;
  };

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

    const promiseAry = to.map<Promise<TranslateReturnWithKey[]>>((toLocale) => {
      return new Promise(async (resolve) => {
        const sentenceInputAry = sentenceAry.map(
          ({ sentence, key }) => sentence
        );
        const { sentence: translatedSentence } = await this.translate({
          sentence: sentenceInputAry.join("\n"),
          from,
          to: toLocale,
        });
        const sentenceResult =
          this.getTranslatedSentenceAryToSentenceWithKeyAry(
            translatedSentence.split("\n"),
            sentenceAry,
            toLocale
          );
        resolve(sentenceResult);
      });
    });
    const multiSentenceResultAry = await Promise.all(promiseAry);

    return multiSentenceResultAry;
  };

  private getTranslatedSentenceAryToSentenceWithKeyAry = (
    translatedSentenceAry: string[],
    sentenceAry: {
      sentence: string;
      key: string;
    }[],
    locale: string
  ) => {
    const result = sentenceAry.map(({ key }, index) => {
      return {
        key,
        sentence: translatedSentenceAry[index],
        locale,
      };
    });
    return result;
  };

  static test = async () => {
    const translateRepo = await GoogleTranslateRepo.getInstance(
      { concurrency: 1 },
      { headless: false }
    );
    const result = await translateRepo.translateMultiLanguage({
      sentenceAry: [
        { sentence: "hello", key: "hello" },
        { sentence: "number", key: "number" },
      ],
      from: "en",
      to: ["ko"],
    });
  };
}
