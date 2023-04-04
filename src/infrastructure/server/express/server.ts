import "module-alias/register";
import { TranslateService } from "@src/application/service/translate/translate.service";
import { TranslateController } from "@src/controller/translate/translate.controller";
import { TranslateProxyValidator } from "@src/controller/translate/translate.validator";
import { TranslateValidator } from "../../validator/zod/translate.validator";
import { GoogleTranslateRepo } from "@src/infrastructure/db/google_browser/translate.repo";
import { ResponseDto } from "@src/controller/dto/response.dto";
import express, {
  NextFunction,
  Request,
  Response,
  Express,
  Router,
} from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "@src/infrastructure/config";
import { LanguageCodeController } from "@src/controller/languageCode/language.code.controller";
import { LanguageCodeValidator } from "@src/infrastructure/validator/zod/language.code.validator";
import { LanguageCodeProxyValidator } from "@src/controller/languageCode/language.code.validator";
import { LanguageCodeNameRepo } from "@src/application/interfaces/languageCode/name.repo";
import { LocalLanguageCodeNameRepo } from "@src/infrastructure/db/languageCode/name.repo";
import { LocalLanguageCodeSiteMapRepo } from "@src/infrastructure/db/languageCode/sitemap.repo";
import { LanguageCodeService } from "@src/application/service/languageCode/language.code.service";

export interface ExpressServerOptions {
  port: number;
  corsOptions: {
    origin: string;
  };
}

export class ExpressServer {
  static instance: ExpressServer | undefined;
  private app: Express;
  private translateRouter: Router;
  private translateController: TranslateProxyValidator | undefined;
  private languageCodeRouter: Router;
  private languageCodeController: LanguageCodeProxyValidator | undefined;

  private server:
    | import("http").Server<
        typeof import("http").IncomingMessage,
        typeof import("http").ServerResponse
      >
    | undefined;
  private corsOption = {
    origin: "*",
    optionsSuccessStatus: 200,
    credentials: true,
  };

  constructor(private options: typeof config) {
    this.corsOption.origin = options.cors.allowedOrigin;

    this.app = express();
    this.app.use(cors(this.corsOption));
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(morgan("tiny"));

    this.translateRouter = Router({ mergeParams: true });
    this.app.use("/translate", this.translateRouter);

    this.languageCodeRouter = Router({ mergeParams: true });
    this.app.use("/language-code", this.translateRouter);

    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    );
  }

  private init = async () => {
    this.translateController = TranslateProxyValidator.getInstance(
      TranslateValidator.getInstance(),
      TranslateController.getInstance(
        TranslateService.getInstance(
          await GoogleTranslateRepo.getInstance(
            { concurrency: this.options.repo.concurrency },
            { headless: this.options.repo.headless }
          )
        )
      )
    );
    this.initTranslateRoute();

    this.languageCodeController = LanguageCodeProxyValidator.getInstance(
      LanguageCodeValidator.getInstance(),
      LanguageCodeController.getInstance(
        LanguageCodeService.getInstance(
          LocalLanguageCodeNameRepo.getInstance(),
          LocalLanguageCodeSiteMapRepo.getInstance()
        )
      )
    );

    this.initLanguageCodeRoute();

    this.server = this.app.listen(this.options.port);
  };

  static getInstance = async (options: typeof config) => {
    if (this.instance) return this.instance;
    this.instance = new ExpressServer(options);
    await this.instance.init();
    return this.instance;
  };

  close = () => {
    this.server!.close();
  };

  private initTranslateRoute = () => {
    this.translateRouter.post(
      "/sentence",
      async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.translateController!.translateSentence(
          req.body
        );
        return this.createResponse(response, res);
      }
    );
    this.translateRouter.post(
      "/sentence/multi",
      async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.translateController!.translateMultiSentence(
          req.body
        );
        return this.createResponse(response, res);
      }
    );
    this.translateRouter.post(
      "/sentence/multi/language",
      async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.translateController!.translateMultiLanguage(
          req.body
        );
        return this.createResponse(response, res);
      }
    );
    this.translateRouter.post(
      "/sentence/multi/language/json",
      async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.translateController!.translateJsonValue(
          req.body
        );
        return this.createResponse(response, res);
      }
    );
  };

  private initLanguageCodeRoute = () => {
    this.languageCodeRouter.post(
      "/name",
      async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.languageCodeController!.getName(req.body);
        return this.createResponse(response, res);
      }
    );

    this.languageCodeRouter.post(
      "/name/multi",
      async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.languageCodeController!.getMultiName(
          req.body
        );
        return this.createResponse(response, res);
      }
    );

    this.languageCodeRouter.post(
      "/name/multi?type=keynamevalue",
      async (req: Request, res: Response, next: NextFunction) => {
        const response =
          await this.languageCodeController!.getMultiCodeToKeyNameValue(
            req.body
          );
        return this.createResponse(response, res);
      }
    );

    this.languageCodeRouter.post(
      "/sitemap",
      async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.languageCodeController!.getSiteMap(
          req.body
        );
        return this.createResponse(response, res);
      }
    );
  };

  private createResponse = (responseDto: ResponseDto, res: Response) => {
    return res.status(responseDto.status).json(responseDto.payload);
  };
}
