import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { NestMiddleware, HttpStatus, Injectable, Scope } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { config } from "../../Config/config";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      let token = req.headers.authorization.split(" ")[1];
      try {
        let result = await (<any>jwt.verify(token, config.SECRET));
        req.user = result;
      } catch (err) {
        //jwt合法但過期
        // if (err.name === "TokenExpiredError") {
        //   //取得過期jwt payload
        //   let result = await (<any>jwt.verify(token, config.SECRET, {
        //     ignoreExpiration: true
        //   }));
        //   req.user = result;
        //   return next();
        // }
        //jwt不合法
        return next(err);
      }
    } else {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    return next();
  }
}
