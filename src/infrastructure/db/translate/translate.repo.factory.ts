import { GoogleTranslateRepo } from "./google_browser/translate.repo";

export type TranslateRepoType = "google_browser";

export class TranslateRepoFactory {
  static getInstance = (type: TranslateRepoType) => {
    switch (type) {
      case "google_browser":
        return GoogleTranslateRepo.getInstance;
      default:
        return GoogleTranslateRepo.getInstance;
    }
  };
}
