import { GoogleTranslateRepo } from "../../../../infrastructure/db/translate/google_browser/translate.repo";

describe("Google Browser Crawler Repo Test", () => {
  let translateRepo: GoogleTranslateRepo;
  beforeAll(async () => {
    translateRepo = await GoogleTranslateRepo.getInstance(
      { concurrency: 1 },
      {
        headless: true,
      }
    );
  });

  afterAll(async () => {
    translateRepo.close();
  }, 10000);

  test("Translate Sentence", async () => {
    const params = {
      sentence: "이것은 번역테스트입니다.\n 맞는지 확인해 보세요.",
      from: "ko",
      to: "es",
    } as const;

    const result = await translateRepo.translate(params);
    const { locale } = result;

    expect.objectContaining<typeof result>({
      locale: expect.any(String),
      sentence: expect.any(String),
    });
    expect(params.to).toEqual(locale);
  });
});
