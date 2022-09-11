import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { NestMiddleware, HttpStatus, Injectable, Scope } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { config } from "../../Config/config";
import { LoginInfoService } from "../../Service/LoginInfo.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly loginInfoService: LoginInfoService) {}

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
        if (err.name === "TokenExpiredError") {
          //取得過期jwt payload
          let result = await (<any>jwt.verify(token, config.SECRET, {
            ignoreExpiration: true
          }));
          req.user = result;
          //確認payload token於資料庫是否存在
          if (
            !(await this.loginInfoService.isLoginTokenValid(result.login_token))
          ) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
          } else {
            //payload存在則刷新token並於回應標頭帶回新jwt
            let refreshToken = await this.loginInfoService.refreshToken(
              result.userid
            );
            res.setHeader("token", refreshToken);
            return next();
          }
        }
        //jwt不合法
        return next(err);
      }
    } else {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
    //jwt合法且未過期 則資料庫比對token
    if (req.user) {
      //檢查登入資訊 token 是否正確
      if (
        !(await this.loginInfoService.isLoginTokenValid(req.user.login_token))
      ) {
        throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      }
    }
    return next();
  }
}
