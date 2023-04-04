import { LanguageCodeSitemapRepo } from "@src/application/interfaces/languageCode/sitemap.repo";
import {
  LanguageCodeSiteMapInputs,
  LanguageCodeSiteMapOptions,
} from "@src/application/service/languageCode/language.code.service";

interface GetUrlListInputs extends Omit<LanguageCodeSiteMapInputs, "pages"> {
  page: string;
  options: Required<LanguageCodeSiteMapOptions>;
}

export class LocalLanguageCodeSiteMapRepo extends LanguageCodeSitemapRepo {
  static instance: LocalLanguageCodeSiteMapRepo | undefined;

  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new LocalLanguageCodeSiteMapRepo();
    return this.instance;
  };

  getSiteMap = (inputs: LanguageCodeSiteMapInputs) => {
    const urlList = this.getAllUrlList(inputs);
    const result = this.addWrap(urlList);
    return {
      siteMap: result.join("\n"),
    };
  };

  private getAllUrlList = ({
    rootUrl,
    pages,
    defaultLocale,
    supportedLocales,
    options,
  }: LanguageCodeSiteMapInputs) => {
    const newOptions = {
      trailingSlash: false,
      lastMod: new Date().toISOString(),
      ...options,
    };

    return pages
      .map((page) => {
        const urlList = this.getUrlList({
          rootUrl,
          page,
          defaultLocale,
          supportedLocales,
          options: newOptions,
        });
        return urlList;
      })
      .flat();
  };

  private getUrlList = ({
    rootUrl,
    page: tempPage,
    defaultLocale,
    supportedLocales,
    options,
  }: GetUrlListInputs) => {
    let page = tempPage;
    if (options.trailingSlash) {
      if (tempPage !== "/") {
        page = tempPage + "/";
      }
    } else if (!options.trailingSlash) {
      if (tempPage === "/") {
        page = "";
      }
    }

    const locList = ["default", ...supportedLocales]
      .filter((locale) => locale !== defaultLocale || locale === "default")
      .map((locale) => {
        if (locale === "default") {
          return `		<loc>${rootUrl}${page}</loc>`;
        }
        return `		<loc>${rootUrl}/${locale}${page}</loc>`;
      });

    const xhtmlList = [
      defaultLocale,
      ...supportedLocales.filter((locale) => locale !== defaultLocale),
    ].map((locale) => {
      let url = `${rootUrl}/${locale}${page}`;
      if (locale === defaultLocale) {
        url = `${rootUrl}${page}`;
      }

      return `		<xhtml:link rel="alternate" hreflang="${locale}" href="${url}" />`;
    });

    const lastmod = `		<lastmod>${new Date(options.lastMod)
      .toISOString()
      .slice(0, 10)}</lastmod>`;
    const urlList = locList.map((loc) => {
      const result: string[] = [];

      result.push("	<url>");
      result.push(loc);
      result.push(...xhtmlList);
      result.push(lastmod);
      result.push("	</url>");

      return result;
    });
    return urlList;
  };

  private addWrap = (urlList: string[][]) => {
    const result = [];
    result.push(
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`
    );
    result.push(...urlList.flat());
    result.push("</urlset>");
    return result;
  };
}
