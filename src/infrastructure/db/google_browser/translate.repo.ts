import { TranslateRepo } from "@src/application/interfaces/translate.repo";
import {
  Sentence,
  TranslateReturn,
} from "@src/application/service/translate/translate.service";
import {
  Browser,
  BrowserContext,
  chromium,
  LaunchOptions,
  Page,
} from "playwright";

interface Options {
  concurrency: number;
}

interface PageWithLock {
  isLocked: boolean;
  index: number;
  page: Page | undefined;
}

export class GoogleTranslateRepo extends TranslateRepo {
  static instance: GoogleTranslateRepo | undefined;
  private pageWithLockAry: PageWithLock[] = [];
  private LOCK_DELAY_MS = 1000;

  private browser: Browser | undefined;
  private context: BrowserContext | undefined;
  private URL = "https://translate.google.co.kr/?hl=en";

  constructor(
    private options?: Options,
    private launchOptions?: LaunchOptions
  ) {
    super();
    this.options = {
      concurrency: 1,
      ...options,
    };
    this.pageWithLockAry = Array.from(
      { length: this.options.concurrency },
      (_, index) => ({ isLocked: false, index, page: undefined })
    );
  }

  static getInstance = async (
    options?: Options,
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
      }, this.LOCK_DELAY_MS);
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
}
