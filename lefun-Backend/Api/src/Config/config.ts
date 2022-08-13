import { env } from "process";
import {
  News,
  SMSAuth,
  User,
  LoginInfo,
  PaymentInfo,
  TransactionLog,
  BehaviorLog,
  PerchaseLog,
  LefunTransaction,
  BackendUser
} from "../Dao/models";

export const DIALECT = "mysql";

const LOCAL_CONFIGURATION = {
  DB: "test",
  PASSWORD: "password",
  PORT_DB: 3306,
  SERVER: "localhost",
  USER_DB: "root2"
};

const PRODUCTION_CONFIGURATION = {
  DB: env.DB,
  PASSWORD: env.PASSWORD,
  PORT_DB: Number(env.PORT_DB),
  SERVER: env.SERVER,
  USER_DB: env.USER_DB
};

const DATABASE = isProduction()
  ? PRODUCTION_CONFIGURATION
  : LOCAL_CONFIGURATION;

const ORM_CONFIGURATION: any = {
  database: DATABASE.DB,
  entities: [
    News,
    SMSAuth,
    LoginInfo,
    User,
    PaymentInfo,
    TransactionLog,
    BehaviorLog,
    PerchaseLog,
    LefunTransaction,
    BackendUser
  ],
  host: DATABASE.SERVER,
  logging: isProduction() ? false : true,
  password: DATABASE.PASSWORD,
  port: DATABASE.PORT_DB,
  synchronize: true,
  type: DIALECT,
  username: DATABASE.USER_DB,
  charset: "utf8mb4"
};

export function isProduction(): boolean {
  return env.NODE_ENV === "PRODUCTION";
}

export const config = {
  DATABASE: isProduction() ? PRODUCTION_CONFIGURATION : LOCAL_CONFIGURATION,
  ORM_CONFIGURATION: ORM_CONFIGURATION,
  PORT_APP: 8080,
  SECRET: env.SECRET,
  MD5SALT: env.MD5SALT,
  TAYPAY_PARTNER_KEY: env.TAYPAY_PARTNER_KEY,
  TAYPAY_MERCHANT_ID: env.TAYPAY_MERCHANT_ID,
  TAYPAY_API: env.TAYPAY_API,
  FB_APP_TOKEN: env.FB_APP_TOKEN,
  FB_API: env.FB_API,
  GOOGLE_API_CLIENTID: env.GOOGLE_API_CLIENTID,
  SMS_EXPRESS_API: env.SMS_EXPRESS_API,
  SMS_EXPRESS_USERNAME: env.SMS_EXPRESS_USERNAME,
  SMS_EXPRESS_PASSWORD: env.SMS_EXPRESS_PASSWORD
};
