interface TranslateRepoInterface {
  translate: ({
    sentence,
    from,
    to,
  }: {
    sentence: string;
    from: string;
    to: string;
  }) => Promise<{
    locale: string;
    sentence: string;
  }>;
}
