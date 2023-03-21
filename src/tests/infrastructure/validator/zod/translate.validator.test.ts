import {
  Sentence,
  SentenceWithKey,
  TranslateJsonValueDto,
  TranslateMultiLanguageDto,
} from "../../../../application/service/translate/translate.service";
import { TranslateValidator } from "../../../../infrastructure/validator/zod/translate.validator";

describe("Zod Translate Dto Validator", () => {
  let validator: TranslateValidator;

  beforeAll(() => {
    validator = TranslateValidator.getInstance();
  });

  describe("SentenceSchema", () => {
    test("Valid Input", () => {
      const params = {
        sentence: "이것은 번역테스트입니다.\n 맞는지 확인해 보세요.",
        from: "ko",
        to: "es",
      } as const;

      validator.translateSentence(params);
    });

    test.each<{ params: Partial<Sentence>; message: string }>([
      {
        params: { sentence: "", from: "ko", to: "es" },
        message: "Invalid 'sentence' Input",
      },
      {
        params: { sentence: "one", from: "k", to: "es" },
        message: "Invalid 'from' Input",
      },
      {
        params: { sentence: "one", from: "ko", to: "e" },
        message: "Invalid 'to' Input",
      },
      {
        params: { sentence: "one", to: "e" },
        message: "Missing 'from' Input",
      },
    ])(`$message`, ({ params }) => {
      try {
        validator.translateSentence(params as any);
      } catch (error) {
        expect(error).toEqual(expect.anything());
      }
    });
  });

  describe("SentenceSchemaWithKey Ary", () => {
    test("Valid Input", () => {
      const params = [
        {
          sentence: "이것은 번역테스트입니다.\n 맞는지 확인해 보세요.",
          from: "ko",
          to: "es",
          key: "key",
        },
        {
          sentence: "이것은 번역테스트입니다.\n 맞는지 확인해 보세요.",
          from: "ko",
          to: "es",
          key: "key",
        },
      ];

      validator.translateMultiSentence(params as any);
    });

    test.each<{ params: Array<Partial<SentenceWithKey>>; message: string }>([
      {
        params: [{ sentence: "", from: "ko", to: "es", key: "key" }],
        message: "Invalid 'sentence' Input",
      },
      {
        params: [{ sentence: "one", from: "k", to: "es", key: "key" }],
        message: "Invalid 'from' Input",
      },
      {
        params: [{ sentence: "one", from: "ko", to: "e", key: "key" }],
        message: "Invalid 'to' Input",
      },
      {
        params: [{ sentence: "one", from: "ko", to: "e", key: "" }],
        message: "Invalid 'key' Input",
      },
      {
        params: [{ sentence: "one", to: "e" }],
        message: "Missing 'from' Input",
      },
    ])(`$message`, ({ params }) => {
      try {
        validator.translateMultiSentence(params as any);
      } catch (error) {
        expect(error).toEqual(expect.anything());
      }
    });
  });

  describe("MultiLanguageSchema", () => {
    test("Valid Input", () => {
      const params = {
        sentenceAry: [
          {
            sentence: "이것은 번역테스트입니다.\n 맞는지 확인해 보세요.",
            key: "key",
          },
        ],
        from: "ko",
        to: ["es", "en"],
      };

      validator.translateMultiLanguage(params);
    });

    test.each<{ params: Partial<TranslateMultiLanguageDto>; message: string }>([
      {
        params: {
          sentenceAry: [],
          from: "ko",
          to: ["en"],
        },
        message: "Invalid 'sentenceAry' Input",
      },
      {
        params: {
          sentenceAry: [
            {
              sentence: "이것은 번역테스트입니다.\n 맞는지 확인해 보세요.",
              key: "key",
            },
          ],
          from: "ko",
          to: [],
        },
        message: "Invalid 'to' Input",
      },
      {
        params: {
          sentenceAry: [
            {
              sentence: "이것은 번역테스트입니다.\n 맞는지 확인해 보세요.",
              key: "key",
            },
          ],
          from: "",
          to: ["en"],
        },
        message: "Invalid 'from' Input",
      },
      {
        params: {
          sentenceAry: [],
          from: "ko",
        },
        message: "Missing 'to' Input",
      },
    ])(`$message`, ({ params }) => {
      try {
        validator.translateMultiSentence(params as any);
      } catch (error) {
        expect(error).toEqual(expect.anything());
      }
    });
  });

  describe("JsonValueSchema", () => {
    test("Valid Input", () => {
      const params = {
        json: {
          bus: "버스",
          car: "자동차",
        },
        from: "ko",
        to: ["es", "en"],
      };

      validator.translateJsonValue(params);
    });

    test.each<{ params: Partial<any>; message: string }>([
      {
        params: {
          json: {
            bus: "버스",
            //@ts-ignore
            car: 1,
          },
          from: "ko",
          to: ["es", "en"],
        },
        message: "Invalid 'json' Input",
      },
      {
        params: {
          json: {
            bus: "버스",
            car: "자동차",
          },
          from: "ko",
          to: [],
        },
        message: "Invalid 'to' Input",
      },
      {
        params: {
          json: {
            bus: "버스",
            car: "자동차",
          },
          from: "",
          to: ["es", "en"],
        },
        message: "Invalid 'from' Input",
      },
      {
        params: {
          json: {
            bus: "버스",
            car: "자동차",
          },
          from: "ko",
        },
        message: "Missing 'to' Input",
      },
    ])(`$message`, ({ params }) => {
      try {
        validator.translateMultiSentence(params as any);
      } catch (error) {
        expect(error).toEqual(expect.anything());
      }
    });
  });
});
