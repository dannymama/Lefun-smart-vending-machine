import { Injectable, Scope, Inject } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { getCustomRepository, getManager } from "typeorm";
import { LoginInfo, User } from "../Dao/models";
import {
  UserRepository,
  SMSAuthRepository,
  LoginInfoRepository,
  BehaviorLogRepository
} from "../Dao/repository";
import { VerifyService } from "./Verify.service";
import { ResultCode } from "../Shared/enums";
import * as JWT from "jsonwebtoken";
import { config } from "../Config/config";
import { Request } from "express";

@Injectable({
  scope: Scope.REQUEST
})
export class LoginInfoService {
  private _loginInfo: LoginInfo;
  constructor(
    private readonly verifyService: VerifyService,
    @Inject(REQUEST) private readonly req: Request
  ) {
    this._loginInfo = new LoginInfo();
  }
  // //登入驗證帳密
  // public async LoginVerifyByAccount(
  //   user_account: string,
  //   user_password: string
  // ): Promise<LoginResult> {
  //   let user = await getCustomRepository(UserRepository).findOneByAccount(
  //     user_account
  //   );
  //   if (!user) {
  //     return { resultCode: ResultCode.ACCOUNT_NOT_EXIST };
  //   }
  //   let { isSuccess } = await this.verifyService
  //     .getVerifyObj("Account")
  //     .verify({
  //       input_password: user_password,
  //       user_password: user.user_password
  //     });
  //   if (!isSuccess) {
  //     return { resultCode: ResultCode.WRONG_PASSWORD };
  //   }
  //   return { resultCode: ResultCode.SUCCESS, userObj: user };
  // }

  //登入驗證smstoken
  public async LoginVerifyBySMS(sms_token: string): Promise<LoginResult> {
    let { isSuccess, data } = await this.verifyService
      .getVerifyObj("SMS")
      .verify({ sms_token });
    if (!isSuccess) {
      return { resultCode: ResultCode.SMS_TOKEN_ERROR };
    }

    let user = await getCustomRepository(UserRepository).findOneByPhoneNum(
      data
    );
    if (!user) {
      return { resultCode: ResultCode.ACCOUNT_NOT_EXIST };
    }

    await getCustomRepository(SMSAuthRepository).setUsed(sms_token);
    return { resultCode: ResultCode.SUCCESS, userObj: user };
  }

  //登入驗證facebook
  public async LoginVerifyByFacebook(
    fb_accesstoken: string
  ): Promise<LoginResult> {
    let { isSuccess, data } = await this.verifyService
      .getVerifyObj("Facebook")
      .verify({ fb_accesstoken });
    if (!isSuccess) {
      return { resultCode: ResultCode.FB_OAUTH_ERROR };
    }
    let user_account = "FB-" + data;
    let user = await getCustomRepository(UserRepository).findOneByOpenID(
      user_account
    );
    if (!user) {
      return { resultCode: ResultCode.ACCOUNT_NOT_EXIST };
    }
    return { resultCode: ResultCode.SUCCESS, userObj: user };
  }

  //登入驗證Google
  public async LoginVerifyByGoogle(
    google_accesstoken: string
  ): Promise<LoginResult> {
    let { isSuccess, data } = await this.verifyService
      .getVerifyObj("Google")
      .verify({ google_accesstoken });
    if (!isSuccess) {
      return { resultCode: ResultCode.GOOGLE_OAUTH_ERROR };
    }
    let user_account = "G-" + data;
    let user = await getCustomRepository(UserRepository).findOneByOpenID(
      user_account
    );
    if (!user) {
      return { resultCode: ResultCode.ACCOUNT_NOT_EXIST };
    }
    return { resultCode: ResultCode.SUCCESS, userObj: user };
  }

  //檢查登入資訊狀態
  public async isLoginTokenValid(login_token: string): Promise<boolean> {
    //確認來源是否存在
    let loginInfo = await getCustomRepository(
      LoginInfoRepository
    ).findOneByToken(login_token);
    //確認來源裝置是否吻合
    if (!loginInfo) {
      return false;
    }
    return true;
  }

  //刷新token
  public async refreshToken(lefun_user_id: string): Promise<string> {
    let user = await getCustomRepository(UserRepository).findOneById(
      lefun_user_id
    );
    return await this.createToken(user);
  }

  //產生簽章資訊及登入資訊
  public async createToken(login_user: User): Promise<string> {
    //產生及刷新資料庫內登入資訊
    let login_token = await getManager().transaction(async manager => {
      //後踢前，清除先前裝置登入資訊並新增登入資訊
      this._loginInfo.user = login_user;
      this._loginInfo.login_ip =
        this.req.header("x-forwarded-for") || this.req.connection.remoteAddress;
      this._loginInfo.login_device_info = this.req.header("User-Agent") || "";
      await manager
        .getCustomRepository(LoginInfoRepository)
        .removeByUserID(login_user.lefun_user_id);
      let result = await manager
        .getCustomRepository(LoginInfoRepository)
        .save(this._loginInfo);
      //行為記錄
      await manager
        .getCustomRepository(BehaviorLogRepository)
        .createOne(
          login_user,
          "登入, DeviceInfo:" + this._loginInfo.login_device_info,
          "LOGIN"
        );
      return result.login_token;
    });
    //回傳簽章
    return this.signToken(
      {
        userid: login_user.lefun_user_id,
        login_token: login_token
      },
      { expiresIn: "7d" }
    );
  }

  //登出
  public async removeToken(
    user_id: string,
    login_token: string
  ): Promise<void> {
    await getManager().transaction(async manager => {
      //清除裝置登入資訊
      let user = await manager
        .getCustomRepository(UserRepository)
        .findOneById(user_id);
      await manager
        .getCustomRepository(LoginInfoRepository)
        .removeByToken(login_token);
      //行為記錄
      await manager
        .getCustomRepository(BehaviorLogRepository)
        .createOne(
          user,
          "登出, DeviceInfo:" + this._loginInfo.login_device_info,
          "LOGOUT"
        );
    });
  }

  private signToken(
    params: { userid: string; login_token: string },
    options?: any
  ): string {
    return JWT.sign(params, config.SECRET, options || undefined);
  }
}

export class LoginResult {
  resultCode: ResultCode;
  userObj?: User;
}
