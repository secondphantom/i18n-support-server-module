import path from "path";
import dotenv from "dotenv";
const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV === "dev") {
  dotenv.config({ path: path.join(__dirname, "../../.env.dev") });
} else if (NODE_ENV === "test") {
  dotenv.config({ path: path.join(__dirname, "../../.env.test") });
} else if (NODE_ENV === "wsl") {
  dotenv.config({ path: path.join(__dirname, "../../.env.wsl") });
} else if (NODE_ENV === "prd") {
  dotenv.config({ path: path.join(__dirname, "../../.env") });
} else {
  throw new Error(
    `process.env.NODE_ENV need => current NODE_ENV: ${process.env.NODE_ENV} `
  );
}

function required(key: string): string {
  let value = process.env[key];
  if (typeof value === "undefined") {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}

export const config = {
  port: parseInt(required("PORT")),
  cors: {
    allowedOrigin: required("CORS_ALLOW_ORIGIN"),
  },
  env: required("NODE_ENV"),
  repo: {
    concurrency: parseInt(required("TRANSLATE_REPO_CONCURRENCY")),
    headless: required("TRANSLATE_REPO_HEADLESS") === "true" ? true : false,
  },
};
