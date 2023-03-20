interface TranslateRepoInterface {
  translate: ({
    sentence,
    from,
    to,
  }: {
    sentence: string;
    from: string;
    to: string;
  }) => {
    locale: string;
    result: string;
  };
}
