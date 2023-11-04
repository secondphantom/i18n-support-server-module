import { LanguageCodeSitemapRepo } from "@src/application/interfaces/languageCode/sitemap.repo";
import {
  LanguageCodeSiteMapInputs,
  LanguageCodeSiteMapOptions,
} from "@src/application/service/languageCode/language.code.service";

interface GetUrlListInputs extends Omit<LanguageCodeSiteMapInputs, "pages"> {
  page: string;
  priority?: number;
  lastMod?: string;
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
      alternateRef: true,
      ...options,
    };

    return pages
      .map((curPage) => {
        if (typeof curPage === "string") {
          const urlList = this.getUrlList({
            rootUrl,
            page: curPage,
            defaultLocale,
            supportedLocales,
            options: newOptions,
          });
          return urlList;
        }
        const {
          page,
          supportedLocales: curSupportedLocales,
          priority,
          lastMod,
        } = curPage;
        const urlList = this.getUrlList({
          rootUrl,
          page,
          defaultLocale,
          supportedLocales: curSupportedLocales,
          lastMod,
          priority,
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
    priority,
    lastMod,
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

    // encode URI
    page = page
      .split("/")
      .map((path) => encodeURI(path))
      .join("/");

    if (!options.alternateRef) supportedLocales = [];

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

    const lastmodXml = lastMod
      ? `		<lastmod>${new Date(lastMod).toISOString().slice(0, 10)}</lastmod>`
      : "";

    const priorityXml = priority
      ? `		<priority>${priority.toFixed(1)}</priority>`
      : "";
    const urlList = locList.map((loc) => {
      const result: string[] = [];

      result.push("	<url>");
      result.push(loc);
      if (options.alternateRef) result.push(...xhtmlList);
      if (lastmodXml) result.push(lastmodXml);
      if (priorityXml) result.push(priorityXml);
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
