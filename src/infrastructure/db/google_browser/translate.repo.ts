import {
  Browser,
  BrowserContext,
  chromium,
  LaunchOptions,
  Page,
} from "playwright";

export class GoogleTranslateRepo implements TranslateRepoInterface {
  static instance: GoogleTranslateRepo | undefined;

  private browser: Browser | undefined;
  private context: BrowserContext | undefined;
  private page: Page | undefined;
  private URL = "https://translate.google.co.kr/?hl=en";
  private cDataId = "";

  constructor(private options: LaunchOptions) {}

  static getInstance = async (options: LaunchOptions) => {
    if (this.instance) return this.instance;
    this.instance = new GoogleTranslateRepo(options);
    await this.instance.init();
    return this.instance;
  };

  private init = async () => {
    this.browser = await chromium.launch(this.options);
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    await this.page.goto(this.URL);
  };

  close = async () => {
    await this.browser?.close();
  };

  translate = async ({
    sentence,
    from,
    to,
  }: {
    sentence: string;
    from: string;
    to: string;
  }) => {
    await this.setUrl({ sentence, from, to });
    const result = await this.getResult();

    return {
      locale: to,
      sentence: result,
    };
  };

  private setUrl = async ({
    sentence,
    from,
    to,
  }: {
    sentence: string;
    from: string;
    to: string;
  }) => {
    const encodeStr = encodeURI(sentence);
    const url = `${this.URL}&sl=${from}&tl=$${to}&text=${encodeStr}&op=translate`;
    await this.page?.goto(url, { waitUntil: "networkidle" });
  };

  private getResult = async () => {
    const result = await (
      await (await this.page?.$("div[aria-live='polite']"))?.$("span")
    )?.innerText();
    if (result === undefined) {
      throw new Error("Fail to translate");
    }
    return result;
  };
}
