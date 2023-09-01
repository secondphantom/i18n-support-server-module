import {
  LanguageCodeWithOptions,
  MultiLanguageCodeWithOptions,
  LanguageCodeSiteMapInputs,
} from "@src/application/service/languageCode/language.code.service";
import { LanguageCodeValidatorInterface } from "@src/controller/languageCode/language.code.interface";
import { z } from "zod";

export class LanguageCodeValidator implements LanguageCodeValidatorInterface {
  static instance: LanguageCodeValidator | undefined;

  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new LanguageCodeValidator();
    return this.instance;
  };

  private optionsSchema = z.object({
    short: z.boolean(),
  });

  private languageCodeWithOptionsSchema = z.object({
    code: z.string().min(2).max(3),
    options: z.optional(this.optionsSchema),
  });

  getName = (dto: LanguageCodeWithOptions) => {
    this.languageCodeWithOptionsSchema.parse(dto);
  };

  private multiLanguageCodeWithOptionsSchema = z.object({
    codeList: z.array(z.string().min(2).max(3)),
    options: z.optional(this.optionsSchema),
  });

  getMultiName = (dto: MultiLanguageCodeWithOptions) => {
    this.multiLanguageCodeWithOptionsSchema.parse(dto);
  };

  getMultiCodeToKeyNameValue = (dto: MultiLanguageCodeWithOptions) => {
    this.multiLanguageCodeWithOptionsSchema.parse(dto);
  };

  private languageCodeSiteMapOptions = z.object({
    trailingSlash: z.boolean().optional(),
    lastMod: z.string().optional(),
  });

  private languageCodeSiteMapInputsSchema = z.object({
    rootUrl: z.string().min(1).startsWith("http"),
    pages: z.array(
      z.union([
        z.string().min(1).startsWith("/"),
        z.object({
          page: z.string().min(1).startsWith("/"),
          supportedLocales: z.array(z.string().min(1).max(3)),
        }),
      ])
    ),
    defaultLocale: z.string().min(2),
    supportedLocales: z.array(z.string().min(1).max(3)),
    options: z.optional(this.languageCodeSiteMapOptions),
  });

  getSiteMap = (dto: LanguageCodeSiteMapInputs) => {
    this.languageCodeSiteMapInputsSchema.parse(dto);
  };
}
