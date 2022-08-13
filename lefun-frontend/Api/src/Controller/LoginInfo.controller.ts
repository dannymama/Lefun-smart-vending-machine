import { Post, Controller, Body, Delete, Req } from "@nestjs/common";
import { LoginInfoService } from "../Service/LoginInfo.service";
import { createLoginInfoBySMSDto } from "../Dto/LoginInfo.dto";
import { getReturnObj, ResultCode, ReturnObj } from "../Shared/enums";
import { Request } from "express";
import { ApiOperation } from "@nestjs/swagger";

@Controller("logininfo")
export class LoginInfoController {
  constructor(private readonly loginInfoService: LoginInfoService) {}

  @Post("sms")
  @ApiOperation({
    title: "登入(SMS))",
    description: "透過簡訊驗證碼方式登入"
  })
  async createBySMSToken(
    @Body() param: createLoginInfoBySMSDto
  ): Promise<ReturnObj> {
    let { resultCode, userObj } = await this.loginInfoService.LoginVerifyBySMS(
      param.sms_token
    );

    let data = {};
    if (resultCode === ResultCode.SUCCESS) {
      //驗證通過產生簽章
      let login_token = await this.loginInfoService.createToken(userObj);
      //回傳簽章
      data = { login_token: login_token };
    }
    return getReturnObj(resultCode, data);
  }

  @Delete()
  @ApiOperation({
    title: "登出",
    description: "登出並清除後端資訊"
  })
  async remove(@Req() req: Request): Promise<ReturnObj> {
    await this.loginInfoService.removeToken(
      req.user.userid,
      req.user.login_token
    );
    return getReturnObj(ResultCode.SUCCESS);
  }
}
