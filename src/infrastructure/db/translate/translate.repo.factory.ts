import { GoogleTranslateRepo } from "./google_browser/translate.repo";

type RepoType = "google_browser";

export class TranslateRepoFactory {
  static getInstance = (type: RepoType) => {
    switch (type) {
      case "google_browser":
        return GoogleTranslateRepo.getInstance;
      default:
        return GoogleTranslateRepo.getInstance;
    }
  };
}
