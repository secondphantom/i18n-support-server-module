import { ExpressServer } from "./express/server";

export type ServerType = "express";

export class ServerFactory {
  static getInstance = (type: ServerType) => {
    switch (type) {
      case "express":
        return ExpressServer.getInstance;
      default:
        return ExpressServer.getInstance;
    }
  };
}
