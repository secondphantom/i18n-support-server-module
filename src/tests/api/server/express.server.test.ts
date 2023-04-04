import { config } from "../../../infrastructure/config";
import { GoogleTranslateRepo } from "../../../infrastructure/db/translate/google_browser/translate.repo";
import { ExpressServer } from "../../../infrastructure/server/express/server";
import { ServerFactory } from "../../../infrastructure/server/server.factory";
import axios, { AxiosInstance } from "axios";

describe("Server integrated Test", () => {
  let server: ExpressServer;
  let request: AxiosInstance;

  beforeAll(async () => {
    const googleTranslateRepo = await GoogleTranslateRepo.getInstance();
    server = await ServerFactory.getInstance("express")(
      { translateRepo: googleTranslateRepo },
      config
    );
    request = axios.create({
      baseURL: `http://localhost:${config.port}`,
      validateStatus: null,
    });
  });

  afterAll(() => {
    server.close();
  });

  describe("/translate", () => {
    describe("POST /translate/sentence", () => {
      describe("When Valid Input", () => {
        test("status code 200", async () => {
          const url = "/translate/sentence";
          const body = {
            sentence: "번역할 문장",
            from: "ko",
            to: "ja",
          };

          const response = await request.post(url, body);
          expect(response.status).toBe(200);
          expect(response.data.data).toEqual(
            expect.objectContaining({
              locale: expect.any(String),
              sentence: expect.any(String),
            })
          );
          expect(response.data.success).toEqual(true);
        }, 10000);
      });

      describe("When Invalid Input", () => {
        test("status code 400", async () => {
          const url = "/translate/sentence";
          const body = {
            sentence: "번역할 문장",
            // from: "ko",
            to: "ja",
          };

          const response = await request.post(url, body);

          expect(response.status).toBe(400);
          expect(response.data.data).toEqual(
            expect.objectContaining({
              message: expect.any(String),
            })
          );
          expect(response.data.success).toEqual(false);
        });
      });
    });

    describe("POST /translate/sentence/multi", () => {
      describe("When Valid Input", () => {
        test("status code 200", async () => {
          const url = "/translate/sentence/multi";
          const body = [
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

          const response = await request.post(url, body);
          expect(response.status).toBe(200);
          response.data.data.forEach((res: any) => {
            expect(res).toEqual(translateReturnWithKeyExpect);
          });
          expect(response.data.success).toEqual(true);
        }, 25000);
      });

      describe("When Invalid Input", () => {
        test("status code 400", async () => {
          const url = "/translate/sentence/multi";
          const body = [
            {
              key: "google",
              sentence: "구글",
              from: "ko",
              to: "ja",
            },
            {
              key: "naver",
              // sentence: "네이버",
              from: "ko",
              to: "ja",
            },
          ];

          const response = await request.post(url, body);

          expect(response.status).toBe(400);
          expect(response.data.data).toEqual(
            expect.objectContaining({
              message: expect.any(String),
            })
          );
          expect(response.data.success).toEqual(false);
        });
      });
    });

    describe("POST /translate/sentence/multi/language", () => {
      describe("When Valid Input", () => {
        test("status code 200", async () => {
          const url = "/translate/sentence/multi/language";
          const body = {
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

          const response = await request.post(url, body);
          expect(response.status).toBe(200);
          response.data.data.flat().forEach((res: any) => {
            expect(res).toEqual(translateReturnWithKeyExpect);
          });
          expect(response.data.success).toEqual(true);
        }, 25000);
      });

      describe("When Invalid Input", () => {
        test("status code 400", async () => {
          const url = "/translate/sentence/multi/language";
          const body = {
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
            // from: "ko",
            to: ["ja", "en"],
          };

          const response = await request.post(url, body);

          expect(response.status).toBe(400);
          expect(response.data.data).toEqual(
            expect.objectContaining({
              message: expect.any(String),
            })
          );
          expect(response.data.success).toEqual(false);
        });
      });
    });

    describe("POST /translate/sentence/multi/language/json", () => {
      describe("When Valid Input", () => {
        test("status code 200", async () => {
          const url = "/translate/sentence/multi/language/json";
          const body = {
            json: {
              bicycle: "자전거",
              car: "자동차",
              bus: "버스",
            },
            from: "ko",
            to: ["ja", "en"],
          };

          const response = await request.post(url, body);
          expect(response.status).toBe(200);
          Object.entries(response.data.data).forEach(([locale, json]) => {
            expect([body.from, ...body.to].includes(locale)).toEqual(true);
            expect(json).toEqual(
              expect.objectContaining({
                bicycle: expect.any(String),
                car: expect.any(String),
                bus: expect.any(String),
              })
            );
          });
          expect(response.data.success).toEqual(true);
        }, 25000);
      });

      describe("When Invalid Input", () => {
        test("status code 400", async () => {
          const url = "/translate/sentence/multi/language/json";
          const body = {
            json: {
              bicycle: "자전거",
              car: "자동차",
              bus: "버스",
            },
            // from: "ko",
            to: ["ja", "en"],
          };

          const response = await request.post(url, body);

          expect(response.status).toBe(400);
          expect(response.data.data).toEqual(
            expect.objectContaining({
              message: expect.any(String),
            })
          );
          expect(response.data.success).toEqual(false);
        });
      });
    });
  });

  describe("/language-code", () => {
    describe("POST /language-code/name", () => {
      describe("When Valid Input", () => {
        test("status code 200", async () => {
          const url = "/language-code/name";
          const body = {
            code: "ko",
          };

          const response = await request.post(url, body);

          expect(response.status).toBe(200);
          expect(response.data.data).toEqual({
            code: "ko",
            name: "Korean",
          });
          expect(response.data.success).toEqual(true);
        });
      });

      describe("When Invalid Input", () => {
        test("status code 400", async () => {
          const url = "/language-code/name";
          const body = {
            // code: "ko",
          };

          const response = await request.post(url, body);

          expect(response.status).toBe(400);
          expect(response.data.data).toEqual(
            expect.objectContaining({
              message: expect.any(String),
            })
          );
          expect(response.data.success).toEqual(false);
        });
      });
    });

    describe("POST /language-code/name/multi", () => {
      describe("When Valid Input", () => {
        test("status code 200", async () => {
          const url = "/language-code/name/multi";
          const body = {
            codeList: ["ko", "en", "ja"],
          };

          const response = await request.post(url, body);

          expect(response.status).toBe(200);
          response.data.data.forEach(({ code, name }: any) => {
            expect(body.codeList.includes(code)).toEqual(true);
            expect(name).toEqual(expect.any(String));
          });
          expect(response.data.success).toEqual(true);
        });

        test("status code 200 ?type=keynamevalue ", async () => {
          const url = "/language-code/name/multi?type=keynamevalue";
          const body = {
            codeList: ["ko", "en", "ja"],
          };

          const response = await request.post(url, body);

          expect(response.status).toBe(200);
          Object.entries(response.data.data).forEach(([key, value]: any) => {
            expect(body.codeList.includes(key)).toEqual(true);
            expect(value).toEqual(expect.any(String));
          });
          expect(response.data.success).toEqual(true);
        });
      });

      describe("When Invalid Input", () => {
        test("status code 400", async () => {
          const url = "/language-code/name/multi";
          const body = {
            // codeList: ["ko", "en", "ja"],
          };

          const response = await request.post(url, body);

          expect(response.status).toBe(400);
          expect(response.data.data).toEqual(
            expect.objectContaining({
              message: expect.any(String),
            })
          );
          expect(response.data.success).toEqual(false);
        });
      });
    });

    describe("POST /language-code/sitemap", () => {
      describe("When Valid Input", () => {
        test("status code 200", async () => {
          const url = "/language-code/sitemap";
          const body = {
            rootUrl: "http://localhost:3031",
            pages: ["/"],
            defaultLocale: "ko",
            supportedLocales: ["en", "ja"],
          };

          const response = await request.post(url, body);

          expect(response.status).toBe(200);
          expect(response.data.data.siteMap).toEqual(expect.any(String));
          expect(response.data.success).toEqual(true);
        });
      });

      describe("When Invalid Input", () => {
        test("status code 400", async () => {
          const url = "/language-code/sitemap";
          const body = {
            rootUrl: "http://localhost:3031",
            pages: ["/"],
            // defaultLocale: "ko",
            supportedLocales: ["en", "ja"],
          };

          const response = await request.post(url, body);

          expect(response.status).toBe(400);
          expect(response.data.data).toEqual(
            expect.objectContaining({
              message: expect.any(String),
            })
          );
          expect(response.data.success).toEqual(false);
        });
      });
    });
  });
});

const translateReturnWithKeyExpect = expect.objectContaining({
  sentence: expect.any(String),
  key: expect.any(String),
  locale: expect.any(String),
});
