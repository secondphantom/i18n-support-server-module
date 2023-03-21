import {
  Sentence,
  TranslateService,
} from "../../../application/service/translate/translate.service";

import { TranslateController } from "../../../controller/translate/translate.controller";

describe("Translate Controller", () => {
  let translateService: Partial<TranslateService> = {};
  let translateController: TranslateController;
  beforeAll(() => {
    translateController = TranslateController.getInstance(
      translateService as TranslateService
    );
  });

  describe("TranslateSentence", () => {
    test("Success", async () => {
      const serviceFnMock = jest.fn(() => "success" as any);
      translateService.translateSentence = serviceFnMock;

      const response = await translateController.translateSentence(
        "any" as any
      );

      expect(serviceFnMock).toBeCalled();
      expect(response.status).toEqual(200);
      expect(response.payload).toMatchObject({
        success: true,
        data: "success",
      });
    });
    test("Fail", async () => {
      const serviceFnMock = jest.fn(() => {
        throw new Error("Error");
      });
      translateService.translateSentence = serviceFnMock;

      const response = await translateController.translateSentence(
        "any" as any
      );

      expect(serviceFnMock).toBeCalled();
      expect(response.status).toEqual(400);
      expect(response.payload).toMatchObject({
        success: false,
        data: {
          message: "Bad Request",
        },
      });
    });
  });

  describe("TranslateMultiSentence", () => {
    test("Success", async () => {
      const serviceFnMock = jest.fn(() => "success" as any);
      translateService.translateMultiSentence = serviceFnMock;

      const response = await translateController.translateMultiSentence(
        "any" as any
      );

      expect(serviceFnMock).toBeCalled();
      expect(response.status).toEqual(200);
      expect(response.payload).toMatchObject({
        success: true,
        data: "success",
      });
    });
    test("Fail", async () => {
      const serviceFnMock = jest.fn(() => {
        throw new Error("Error");
      });
      translateService.translateMultiSentence = serviceFnMock;

      const response = await translateController.translateMultiSentence(
        "any" as any
      );

      expect(serviceFnMock).toBeCalled();
      expect(response.status).toEqual(400);
      expect(response.payload).toMatchObject({
        success: false,
        data: {
          message: "Bad Request",
        },
      });
    });
  });

  describe("TranslateMultiLanguage", () => {
    test("Success", async () => {
      const serviceFnMock = jest.fn(() => "success" as any);
      translateService.translateMultiLanguage = serviceFnMock;

      const response = await translateController.translateMultiLanguage(
        "any" as any
      );

      expect(serviceFnMock).toBeCalled();
      expect(response.status).toEqual(200);
      expect(response.payload).toMatchObject({
        success: true,
        data: "success",
      });
    });
    test("Fail", async () => {
      const serviceFnMock = jest.fn(() => {
        throw new Error("Error");
      });
      translateService.translateMultiLanguage = serviceFnMock;

      const response = await translateController.translateMultiLanguage(
        "any" as any
      );

      expect(serviceFnMock).toBeCalled();
      expect(response.status).toEqual(400);
      expect(response.payload).toMatchObject({
        success: false,
        data: {
          message: "Bad Request",
        },
      });
    });
  });

  describe("TranslateJsonValue", () => {
    test("Success", async () => {
      const serviceFnMock = jest.fn(() => "success" as any);
      translateService.translateJsonValue = serviceFnMock;

      const response = await translateController.translateJsonValue(
        "any" as any
      );

      expect(serviceFnMock).toBeCalled();
      expect(response.status).toEqual(200);
      expect(response.payload).toMatchObject({
        success: true,
        data: "success",
      });
    });
    test("Fail", async () => {
      const serviceFnMock = jest.fn(() => {
        throw new Error("Error");
      });
      translateService.translateJsonValue = serviceFnMock;

      const response = await translateController.translateJsonValue(
        "any" as any
      );

      expect(serviceFnMock).toBeCalled();
      expect(response.status).toEqual(400);
      expect(response.payload).toMatchObject({
        success: false,
        data: {
          message: "Bad Request",
        },
      });
    });
  });
});
