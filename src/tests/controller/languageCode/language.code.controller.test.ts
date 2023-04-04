import { LanguageCodeService } from "../../../application/service/languageCode/language.code.service";
import { LanguageCodeController } from "../../../controller/languageCode/language.code.controller";

describe("Language Code Controller", () => {
  let languageCodeService: Partial<LanguageCodeService> = {};
  let languageCodeController: LanguageCodeController;
  beforeAll(() => {
    languageCodeController = LanguageCodeController.getInstance(
      languageCodeService as LanguageCodeService
    );
  });

  describe("Get Name", () => {
    test("Success", async () => {
      const serviceFnMock = jest.fn(() => "success" as any);
      languageCodeService.getName = serviceFnMock;

      const response = await languageCodeController.getName("any" as any);

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
      languageCodeService.getName = serviceFnMock;

      const response = await languageCodeController.getName("any" as any);

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

  describe("Get MultiName", () => {
    test("Success", async () => {
      const serviceFnMock = jest.fn(() => "success" as any);
      languageCodeService.getMultiName = serviceFnMock;

      const response = await languageCodeController.getMultiName("any" as any);

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
      languageCodeService.getMultiName = serviceFnMock;

      const response = await languageCodeController.getMultiName("any" as any);

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

  describe("Get Multi Code To Key Name Value", () => {
    test("Success", async () => {
      const serviceFnMock = jest.fn(() => "success" as any);
      languageCodeService.getMultiCodeToKeyNameValue = serviceFnMock;

      const response = await languageCodeController.getMultiCodeToKeyNameValue(
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
      languageCodeService.getMultiCodeToKeyNameValue = serviceFnMock;

      const response = await languageCodeController.getMultiCodeToKeyNameValue(
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

  describe("Get SiteMap", () => {
    test("Success", async () => {
      const serviceFnMock = jest.fn(() => "success" as any);
      languageCodeService.getSiteMap = serviceFnMock;

      const response = await languageCodeController.getSiteMap("any" as any);

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
      languageCodeService.getSiteMap = serviceFnMock;

      const response = await languageCodeController.getSiteMap("any" as any);

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
