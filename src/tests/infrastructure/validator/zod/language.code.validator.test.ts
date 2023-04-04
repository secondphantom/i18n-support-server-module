import { LanguageCodeValidator } from "../../../../infrastructure/validator/zod/language.code.validator";

describe("Zod Language Dto Validator", () => {
  let validator: LanguageCodeValidator;

  beforeAll(() => {
    validator = LanguageCodeValidator.getInstance();
  });

  describe("languageCodeWithOptionsSchema", () => {
    test("Valid Input", () => {
      const params = {
        code: "ko",
        options: {
          short: true,
        },
      } as const;

      validator.getName(params);
    });

    test.each<{ params: any; message: string }>([
      {
        params: { code: "koasdf" },
        message: "Invalid 'code' Input",
      },
      {
        params: { code: "ko", options: { short: "str" } },
        message: "Invalid 'options' Input",
      },
      {
        params: {},
        message: "Missing 'code' Input",
      },
    ])(`$message`, ({ params }) => {
      try {
        validator.getName(params as any);
      } catch (error) {
        expect(error).toEqual(expect.anything());
      }
    });
  });

  describe("multiLanguageCodeWithOptionsSchema", () => {
    test("Valid Input", () => {
      const params = {
        codeList: ["ko", "en"],
        options: {
          short: true,
        },
      };

      validator.getMultiName(params);
      validator.getMultiCodeToKeyNameValue(params);
    });

    test.each<{ params: any; message: string }>([
      {
        params: { codeList: ["ko", "endfs"] },
        message: "Invalid 'codeList' Input",
      },
      {
        params: { codeList: ["ko", "en"], options: { short: "str" } },
        message: "Invalid 'options' Input",
      },
      {
        params: {},
        message: "Missing 'codeList' Input",
      },
    ])(`$message`, ({ params }) => {
      try {
        validator.getName(params as any);
      } catch (error) {
        expect(error).toEqual(expect.anything());
      }
      try {
        validator.getMultiCodeToKeyNameValue(params as any);
      } catch (error) {
        expect(error).toEqual(expect.anything());
      }
    });
  });

  describe("languageCodeSiteMapInputsSchema", () => {
    test("Valid Input", () => {
      const params = {
        rootUrl: "https://localhost",
        pages: ["/", "/history"],
        defaultLocale: "ko",
        supportedLocales: ["en", "ja"],
        options: {
          trailingSlash: true,
          lastMod: new Date().toISOString(),
        },
      };

      validator.getSiteMap(params);
    });

    test.each<{ params: any; message: string }>([
      {
        params: {
          rootUrl: "ddhttps://localhost",
          pages: ["/", "/history"],
          defaultLocale: "ko",
          supportedLocales: ["en", "ja"],
        },
        message: "Invalid 'rootUrl' Input",
      },
      {
        params: {
          rootUrl: "https://localhost",
          pages: ["", "/history"],
          defaultLocale: "ko",
          supportedLocales: ["en", "ja"],
        },
        message: "Invalid 'pages' Input",
      },
      {
        params: {
          rootUrl: "https://localhost",
          pages: ["/", "/history"],
          defaultLocale: "kosdsdf",
          supportedLocales: ["en", "ja"],
        },
        message: "Invalid 'defaultLocale' Input",
      },
      {
        params: {
          rootUrl: "https://localhost",
          pages: ["/", "/history"],
          defaultLocale: "ko",
          supportedLocales: ["sdfsfen", "ja"],
        },
        message: "Invalid 'supportedLocales' Input",
      },
      {
        params: {
          rootUrl: "https://localhost",
          pages: ["/", "/history"],
          defaultLocale: "ko",
          supportedLocales: ["sdfsfen", "ja"],
          options: {
            trailingSlash: "str",
            lastMod: new Date().toISOString(),
          },
        },
        message: "Invalid 'options' Input",
      },
      {
        params: {
          // rootUrl: "https://localhost",
          pages: ["/", "/history"],
          defaultLocale: "ko",
          supportedLocales: ["en", "ja"],
        },
        message: "Missing 'rootUrl' Input",
      },
      {
        params: {
          rootUrl: "https://localhost",
          // pages: ["/", "/history"],
          defaultLocale: "ko",
          supportedLocales: ["en", "ja"],
        },
        message: "Missing 'pages' Input",
      },
      {
        params: {
          rootUrl: "https://localhost",
          pages: ["/", "/history"],
          // defaultLocale: "ko",
          supportedLocales: ["en", "ja"],
        },
        message: "Missing 'defaultLocale' Input",
      },
      {
        params: {
          rootUrl: "https://localhost",
          pages: ["/", "/history"],
          defaultLocale: "ko",
          // supportedLocales: ["en", "ja"],
        },
        message: "Missing 'supportedLocales' Input",
      },
    ])(`$message`, ({ params }) => {
      try {
        validator.getName(params as any);
      } catch (error) {
        expect(error).toEqual(expect.anything());
      }
    });
  });
});
