import { LanguageCodeNameRepo } from "@src/application/interfaces/languageCode/name.repo";
import {
  LanguageCodeKeyWithName,
  LanguageCodeWithName,
  LanguageCodeWithOptions,
  MultiLanguageCodeWithOptions,
} from "@src/application/service/languageCode/language.code.service";
import fs from "fs";
import path from "path";

interface RawFileInfo {
  English: string;
  alpha2: string;
  "alpha3-b": string;
}

export class LocalLanguageCodeNameRepo extends LanguageCodeNameRepo {
  static instance: LocalLanguageCodeNameRepo | undefined;

  private alpha3 = new Map<string, string>();
  private alpha2 = new Map<string, string>();
  private languageCodeFilePath: string;

  constructor(languageCodeFilePath?: string) {
    super();
    this.languageCodeFilePath = languageCodeFilePath
      ? languageCodeFilePath
      : path.join(__dirname, "../../../../json/language-codes-3b2.json");

    const languageCodeJson = fs.readFileSync(this.languageCodeFilePath, {
      encoding: "utf-8",
    });

    const languageCodeList = JSON.parse(languageCodeJson) as RawFileInfo[];
    languageCodeList.forEach((languageCode) => {
      this.alpha2.set(languageCode.alpha2, languageCode.English);
      this.alpha3.set(languageCode["alpha3-b"], languageCode.English);
    });
  }

  static getInstance = (languageCodeFilePath?: string) => {
    if (this.instance) return this.instance;
    this.instance = new LocalLanguageCodeNameRepo(languageCodeFilePath);
    return this.instance;
  };

  private validateCode = (code: string) => {
    if (code.length > 3) return false;
    if (code.length === 2 && this.alpha2.has(code)) return true;
    if (code.length === 3 && this.alpha3.has(code)) return true;
    return false;
  };

  getName = ({ code, options }: LanguageCodeWithOptions) => {
    options = {
      short: true,
      ...options,
    };
    if (!this.validateCode(code)) throw new Error("Locale Code is not valid");
    if (code.length === 2) {
      const languageNameList = this.alpha2
        .get(code)!
        .split("; ")
        .map((str: string) => str.split(", "))
        .flat();
      const name = options.short
        ? languageNameList[0]
        : languageNameList.join(", ");
      return {
        code,
        name,
      };
    }
    const languageNameList = this.alpha3.get(code)!.split("; ");
    const name = options.short
      ? languageNameList[0]
      : languageNameList.join(", ");
    return {
      code,
      name,
    };
  };

  getMultiName = ({ codeList, options }: MultiLanguageCodeWithOptions) => {
    return codeList.map((code) => {
      return this.getName({ code, options });
    });
  };

  getMultiCodeToKeyNameValue = ({
    codeList,
    options,
  }: MultiLanguageCodeWithOptions) => {
    const multipleLanguageNameList = this.getMultiName({ codeList, options });
    const result: { [key in string]: string } = {};
    return multipleLanguageNameList.reduce((acc, cur, index) => {
      const { code, name } = cur;
      acc = {
        ...acc,
        [code]: name,
      };
      return acc;
    }, result);
  };
}
