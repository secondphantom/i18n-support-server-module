class GoogleTranslateRepo implements TranslateRepoInterface {
  translate = ({
    sentence,
    from,
    to,
  }: {
    sentence: string;
    from: string;
    to: string;
  }) => {
    return {
      locale: "",
      result: "",
    };
  };
}
