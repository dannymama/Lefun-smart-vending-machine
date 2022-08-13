import { Put, Post, Controller, Body } from "@nestjs/common";
import { SMSAuthService } from "../Service/SMSAuth.service";
import { createSMSTokenDto, verifyCodeDto } from "../Dto/SMSAuth.dto";
import { getReturnObj, ResultCode, ReturnObj } from "../Shared/enums";

@Controller("sms")
export class SMSAuthController {
  constructor(private readonly smsService: SMSAuthService) {}

  // @Post()
  // async createSMSToken(@Body() param: createSMSTokenDto): Promise<ReturnObj> {
  //   let sms_token = await this.smsService.createSMSToken(param.phone_number);
  //   return getReturnObj(ResultCode.SUCCESS, { sms_token: sms_token });
  // }

  // @Put()
  // async verifyCode(@Body() param: verifyCodeDto): Promise<ReturnObj> {
  //   let { resultCode } = await this.smsService.verifySMSToken(
  //     param.sms_token,
  //     param.verify_code
  //   );
  //   return getReturnObj(resultCode);
  // }
}
