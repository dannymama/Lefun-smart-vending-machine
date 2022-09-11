import { Put, Post, Controller, Body } from "@nestjs/common";
import { SMSAuthService } from "../Service/SMSAuth.service";
import { createSMSTokenDto, verifyCodeDto } from "../Dto/SMSAuth.dto";
import { getReturnObj, ResultCode, ReturnObj } from "../Shared/enums";
import { ApiOperation } from "@nestjs/swagger";

@Controller("sms")
export class SMSAuthController {
  constructor(private readonly smsService: SMSAuthService) {}

  @Post()
  @ApiOperation({
    title: "發送sms驗證簡訊",
    description: "新增簡訊驗證紀錄並發送簡訊驗證碼至該手機門號"
  })
  async createSMSToken(@Body() param: createSMSTokenDto): Promise<ReturnObj> {
    let sms_token = await this.smsService.createSMSToken(param.phone_number);
    return getReturnObj(ResultCode.SUCCESS, { sms_token: sms_token });
  }

  @Put()
  @ApiOperation({
    title: "驗證簡訊驗證碼",
    description: "驗證簡訊驗證碼"
  })
  async verifyCode(@Body() param: verifyCodeDto): Promise<ReturnObj> {
    let { resultCode } = await this.smsService.verifySMSToken(
      param.sms_token,
      param.verify_code
    );
    return getReturnObj(resultCode);
  }
}
