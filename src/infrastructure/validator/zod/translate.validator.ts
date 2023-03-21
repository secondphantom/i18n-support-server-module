import {
  Sentence,
  SentenceWithKey,
  TranslateMultiLanguageDto,
  TranslateJsonValueDto,
} from "@src/application/service/translate/translate.service";
import { z } from "zod";
import { TranslateValidatorInterface } from "@src/controller/interface/translate.interface";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export class TranslateValidator implements TranslateValidatorInterface {
  static instance: TranslateValidator | undefined;

  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new TranslateValidator();
    return this.instance;
  };

  private sentenceSchema = z.object({
    sentence: z.string().min(1),
    from: z.string().min(2).max(5),
    to: z.string().min(2).max(5),
  });

  translateSentence = (dto: Sentence) => {
    this.sentenceSchema.parse(dto);
  };

  private sentenceWithKeyArySchema = z
    .array(
      z.object({
        sentence: z.string().min(1),
        from: z.string().min(2).max(5),
        to: z.string().min(2).max(5),
        key: z.string().min(1),
      })
    )
    .min(1);

  translateMultiSentence = (dto: SentenceWithKey[]) => {
    this.sentenceWithKeyArySchema.parse(dto);
  };

  private multiLanguageSchema = z.object({
    sentenceAry: z
      .array(
        z.object({
          sentence: z.string().min(1),
          key: z.string().min(1),
        })
      )
      .min(1),
    from: z.string().min(2).max(5),
    to: z.array(z.string().min(2).max(5)).min(1),
  });

  translateMultiLanguage = (dto: TranslateMultiLanguageDto) => {
    this.multiLanguageSchema.parse(dto);
  };

  private jsonValueSchema = z.object({
    json: z.record(z.string().min(1)),
    from: z.string().min(2).max(5),
    to: z.array(z.string().min(2).max(5)).min(1),
  });

  translateJsonValue = (dto: TranslateJsonValueDto) => {
    this.jsonValueSchema.parse(dto);
  };
}
