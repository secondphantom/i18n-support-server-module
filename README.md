# i18n support server and module
i18n Related Support Modules and Server

[API Docs](https://secondphantom.github.io/i18n-support-server-module/)

- translate multiple sentence
- get language name by language code
- get sitemap by multiple language code

# Table of Contents
- [i18n support server and module](#i18n-support-server-and-module)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Module](#module)
	- [Example](#example)
	- [Translator](#translator)
		- [Class](#class)
		- [Constructor Parameters](#constructor-parameters)
		- [Translate](#translate)
			- [Methods](#methods)
				- [`translateSentence`](#translatesentence)
					- [inputs](#inputs)
					- [return](#return)
				- [`translateMultiSentence`](#translatemultisentence)
					- [inputs](#inputs-1)
					- [return](#return-1)
				- [`translateMultiLanguage`](#translatemultilanguage)
					- [inputs](#inputs-2)
					- [return](#return-2)
				- [`translateJsonValue`](#translatejsonvalue)
					- [inputs](#inputs-3)
					- [return](#return-3)
	- [LanguageCode](#languagecode)
		- [Class](#class-1)
		- [Language Code](#language-code)
			- [Methods](#methods-1)
				- [`getName`](#getname)
					- [inputs](#inputs-4)
					- [return](#return-4)
				- [`getMultiName`](#getmultiname)
					- [inputs](#inputs-5)
					- [return](#return-5)
				- [`getMultiCodeToKeyNameValue`](#getmulticodetokeynamevalue)
					- [inputs](#inputs-6)
					- [return](#return-6)
				- [`getSiteMap`](#getsitemap)
					- [inputs](#inputs-7)
					- [return](#return-7)
- [Server](#server)
	- [Example](#example-1)
	- [Factory](#factory)
	- [Request](#request)
		- [Translate](#translate-1)
			- [URLs](#urls)
				- [`/translate/sentence`](#translatesentence-1)
				- [`/translate/sentence/multi`](#translatesentencemulti)
				- [`/translate/sentence/multi/language`](#translatesentencemultilanguage)
				- [`/translate/sentence/multi/language/json`](#translatesentencemultilanguagejson)
		- [Language Code](#language-code-1)
			- [URLs](#urls-1)
				- [`/language-code/name`](#language-codename)
				- [`/language-code/name/multi`](#language-codenamemulti)
				- [`/language-code/name/multi?type=keynamevalue`](#language-codenamemultitypekeynamevalue)
				- [`/language-code/sitemap`](#language-codesitemap)

# Installation
```
npm i https://github.com/secondphantom/i18n-support-server-module
```
# Module
type: `class`
## Example
```ts
(async () => {
  const translateController = new Translator();
  await translateController.init();

  const input = {
    json: {
      bicycle: "자전거",
      car: "자동차",
      bus: "버스",
    },
    from: "ko",
    to: ["ja", "en"],
  };
  const result = await translateController.translateJsonValue(input);

  console.log(result);
  /*
	{
		ja: { bicycle: '自転車', car: '自動車', bus: 'バス' },
		en: { bicycle: 'bicycle', car: 'automobile', bus: 'bus' },
		ko: { bicycle: '자전거', car: '자동차', bus: '버스' }
	}
	*/
})();
```
## Translator
### Class
```ts
const controller = new Translator(options?)
await controller.init()
```
### Constructor Parameters
```ts
interface TranslatorOptions {
  translateRepo?: {
    type: TranslateRepoType;
    options?: TranslateRepoOptions;
    launchOptions?: LaunchOptions;
  };
}
type TranslateRepoType = "google_browser";

interface TranslateRepoOptions {
  concurrency: number;
  lockDelayMs?: number;
}
```
### Translate
When a sentence is input, it responds with the translated content in multiple languages
#### Methods
##### `translateSentence`
###### inputs
*Sentence*
```ts
interface Sentence {
  sentence: string;
  from: string;
  to: string;
}
```
###### return
*TranslateReturn*
```ts
interface TranslateReturn {
  locale: string;
  sentence: string;
}
```
##### `translateMultiSentence`
###### inputs
Array of *SentenceWithKey*
```ts
interface SentenceWithKey {
	sentence: string;
	from: string;
	to: string;
	key: string;
}
```
###### return
Array of *TranslateReturnWithKey*
```ts
interface TranslateReturnWithKey {
	locale: string;
	sentence: string;
	key:string;
}
```
##### `translateMultiLanguage`
###### inputs
*TranslateMultiLanguageDto*
```ts
interface TranslateMultiLanguageDto {
  sentenceAry: { sentence: string; key: string }[];
  from: string;
  to: string[];
}
```
###### return
Array of *Array of TranslateReturnWithKey*
```ts
interface TranslateReturnWithKey {
	locale: string;
	sentence: string;
	key:string;
}
```
##### `translateJsonValue`
###### inputs
*TranslateJsonValueDto*
```ts
interface TranslateJsonValueDto {
  json: { [key in string]: string };
  from: string;
  to: string[];
}
```
###### return
*Return*
```ts
type Return = {
    [key: string]: {
        [key: string]: string;
    };
}
```
## LanguageCode
### Class
```ts
const controller = new LanguageCode();
```
### Language Code
If a language code is given, it responds with the language or sitemap.xml according to the code.
#### Methods
##### `getName`
###### inputs
*LanguageCodeWithOptions*
```ts
interface Options {
  short: boolean;
}
interface LanguageCodeWithOptions {
  code: string;
  options?: Options;
}
```
###### return
*LanguageCodeWithName*
```ts
interface LanguageCodeWithName {
  code: string;
  name: string;
}
```
##### `getMultiName`
###### inputs
*MultiLanguageCodeWithOptions*
```ts
interface Options {
  short: boolean;
}
interface MultiLanguageCodeWithOptions {
  codeList: string[];
  options?: Options;
}
```
###### return
Array of *LanguageCodeWithName*
```ts
interface LanguageCodeWithName {
  code: string;
  name: string;
}
```
##### `getMultiCodeToKeyNameValue`
###### inputs
*[MultiLanguageCodeWithOptions](#inputs-5)*
###### return
*Return*
```ts
type Return {
    [x: string]: string;
}
```
##### `getSiteMap`
###### inputs
*LanguageCodeSiteMapInputs*
```ts
interface LanguageCodeSiteMapInputs {
  rootUrl: string;
  pages: (
    | string
    | {
        page: string;
        supportedLocales: string[];
        priority?: number;
        lastMod?: string;
      }
  )[];
  defaultLocale: string;
  supportedLocales: string[];
  options?: LanguageCodeSiteMapOptions;
}
interface LanguageCodeSiteMapOptions {
  trailingSlash?: boolean;
  alternateRef?: boolean;
}
```
###### return
*LanguageCodeSiteMapReturn*
```ts
interface LanguageCodeSiteMapReturn {
  siteMap: string;
}
```
# Server
type: `class`
## Example
```ts
(async () => {
  const server = await i18nSupportServerFactory("express");
  const url = "http://localhost:3000/translate/sentence/multi/language/json";
  const body = {
    json: {
      bicycle: "자전거",
      car: "자동차",
      bus: "버스",
    },
    from: "ko",
    to: ["ja", "en"],
  };

  const result = await fetch(url, {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    return response.json();
  });

  console.log(result);
  /*
	{
		success: true,
		data: {
			ja: { bicycle: '自転車', car: '自動車', bus: 'バス' },
			en: { bicycle: 'bicycle', car: 'automobile', bus: 'bus' },
			ko: { bicycle: '자전거', car: '자동차', bus: '버스' }
		}
	}
	*/
  server.close();
})();
```
## Factory
```ts
i18nSupportServerFactory: (type: ServerType, options?: ServerOptions) => Promise<ExpressServer>
```
## Request
### Translate
If a sentence or JSON is given, it responds with the translation into multiple languages
#### URLs
##### `/translate/sentence`
- url: "/translate/sentence"
- method: `POST`
- request body: [*Sentence*](#inputs)
- response body: [*TranslateReturn*](#return)
##### `/translate/sentence/multi`
- url: "/translate/sentence/multi"
- method: `POST`
- request body: [Array of *SentenceWithKey*](#inputs-1)
- response body: [Array of *TranslateReturnWithKey*](#return-1)
##### `/translate/sentence/multi/language`
- url: "/translate/sentence/multi/language"
- method: `POST`
- request body: [*TranslateMultiLanguageDto*](#inputs-2)
- response body: [Array of *Array of TranslateReturnWithKey*](#return-2)
##### `/translate/sentence/multi/language/json`
- url: "/translate/sentence/multi/language/json"
- method: `POST`
- request body: [*TranslateJsonValueDto*](#inputs-3)
- response body: [*Return*](#return-3)
### Language Code
If a language code is given, it responds with the language or sitemap.xml according to the code.
#### URLs
##### `/language-code/name`
- url: "/language-code/name"
- method: `POST`
- request body: [*LanguageCodeWithOptions*](#inputs-4)
- response body: [*LanguageCodeWithName*](#return-4)
##### `/language-code/name/multi`
- url: "/language-code/name/multi"
- method: `POST`
- request body: [*MultiLanguageCodeWithOptions*](#inputs-5)
- response body: [Array of *LanguageCodeWithName*](#return-5)
##### `/language-code/name/multi?type=keynamevalue`
- url: "/language-code/name/multi?type=keynamevalue"
- method: `POST`
- request body: [*MultiLanguageCodeWithOptions*](#inputs-6)
- response body: [*Return*](#return-6)
##### `/language-code/sitemap`
- url: "/language-code/sitemap"
- method: `POST`
- request body: [*LanguageCodeSiteMapInputs*](#inputs-7)
- response body: [*LanguageCodeSiteMapReturn*](#return-7)
