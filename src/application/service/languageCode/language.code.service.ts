import { LanguageCodeNameRepo } from "@src/application/interfaces/languageCode/name.repo";
import { LanguageCodeSitemapRepo } from "@src/application/interfaces/languageCode/sitemap.repo";

interface Options {
  short: boolean;
}

export interface LanguageCodeWithOptions {
  code: string;
  options?: Options;
}

export interface MultiLanguageCodeWithOptions {
  codeList: string[];
  options?: Options;
}

export interface LanguageCodeWithName {
  code: string;
  name: string;
}

export type LanguageCodeKeyWithName = { [key in string]: string };

export interface LanguageCodeSiteMapInputs {
  rootUrl: string;
  pages: string[];
  defaultLocale: string;
  supportedLocales: string[];
  options?: LanguageCodeSiteMapOptions;
}

export interface LanguageCodeSiteMapOptions {
  trailingSlash?: boolean;
  lastMod?: string;
}

export interface LanguageCodeSiteMapReturn {
  siteMap: string;
}

export class LanguageCodeService {
  static instance: LanguageCodeService | undefined;

  constructor(
    private languageCodeNameRepo: LanguageCodeNameRepo,
    private languageCodeSiteMapRepo: LanguageCodeSitemapRepo
  ) {}

  static getInstance = (
    languageCodeNameRepo: LanguageCodeNameRepo,
    languageCodeSiteMapRepo: LanguageCodeSitemapRepo
  ) => {
    if (this.instance) return this.instance;
    this.instance = new LanguageCodeService(
      languageCodeNameRepo,
      languageCodeSiteMapRepo
    );
    return this.instance;
  };

  getName = async (
    dto: LanguageCodeWithOptions
  ): Promise<LanguageCodeWithName> => {
    return this.languageCodeNameRepo.getName(dto);
  };

  getMultiName = async (
    dto: MultiLanguageCodeWithOptions
  ): Promise<LanguageCodeWithName[]> => {
    return this.languageCodeNameRepo.getMultiName(dto);
  };

  getMultiCodeToKeyNameValue = async (
    dto: MultiLanguageCodeWithOptions
  ): Promise<LanguageCodeKeyWithName> => {
    const { codeList, options } = dto;
    const multipleLanguageNameList = await this.getMultiName({
      codeList,
      options,
    });
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

  getSiteMap = async (dto: LanguageCodeSiteMapInputs) => {
    return this.languageCodeSiteMapRepo.getSiteMap(dto);
  };
}
