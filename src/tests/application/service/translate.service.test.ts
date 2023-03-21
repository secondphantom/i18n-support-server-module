import {
  TranslateJsonValueDto,
  TranslateReturnWithKey,
  TranslateService,
} from "../../../application/service/translate/translate.service";
import { GoogleTranslateRepo } from "../../../infrastructure/db/google_browser/translate.repo";

describe("Translate Service Test", () => {
  let translateService: TranslateService;
  let translateRepo: GoogleTranslateRepo;
  beforeAll(async () => {
    translateRepo = await GoogleTranslateRepo.getInstance(
      { concurrency: 3 },
      { headless: true }
    );
    translateService = await TranslateService.getInstance(translateRepo);
  });

  afterAll(() => {
    translateRepo.close();
  });

  test("Translate Sentence", async () => {
    const params = {
      sentence: "번역할 문장",
      from: "ko",
      to: "ja",
    };

    const result = await translateService.translateSentence(params);
    const { locale } = result;

    expect.objectContaining<typeof result>({
      locale: expect.any(String),
      sentence: expect.any(String),
    });
    expect(params.to).toEqual(locale);
  }, 10000);

  test("Translate Multiple Sentence", async () => {
    const params = [
      {
        key: "google",
        sentence: "구글",
        from: "ko",
        to: "ja",
      },
      {
        key: "naver",
        sentence: "네이버",
        from: "ko",
        to: "ja",
      },
    ];

    const resultAry = await translateService.translateMultiSentence(params);

    resultAry.forEach((res) => {
      expect(res).toEqual(translateReturnWithKeyExpect);
    });
  }, 10000);

  test("Translate Multiple Language", async () => {
    const params = {
      sentenceAry: [
        {
          key: "bus",
          sentence: "버스",
        },
        {
          key: "car",
          sentence: "자동차",
        },
      ],
      from: "ko",
      to: ["ja", "en"],
    };

    const resultAry = await translateService.translateMultiLanguage(params);

    resultAry.flat().forEach((res) => {
      expect(res).toEqual(translateReturnWithKeyExpect);
    });
  }, 15000);

  test("Translate JSON Value", async () => {
    const params: TranslateJsonValueDto = {
      json: {
        bicycle: "자전거",
        car: "자동차",
        bus: "버스",
      },
      from: "ko",
      to: ["ja", "en"],
    };

    const result = await translateService.translateJsonValue(params);

    Object.entries(result).forEach(([locale, json]) => {
      expect([params.from, ...params.to].includes(locale)).toEqual(true);
      expect(json).toEqual(
        expect.objectContaining({
          bicycle: expect.any(String),
          car: expect.any(String),
          bus: expect.any(String),
        })
      );
    });
  }, 30000);
});

const translateReturnWithKeyExpect =
  expect.objectContaining<TranslateReturnWithKey>({
    sentence: expect.any(String),
    key: expect.any(String),
    locale: expect.any(String),
  });
