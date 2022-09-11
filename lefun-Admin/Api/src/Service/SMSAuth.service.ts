import { Injectable } from "@nestjs/common";
import { getCustomRepository } from "typeorm";
import { SMSAuth } from "../Dao/models";
import { SMSAuthRepository } from "../Dao/repository";
import { ResultCode } from "../Shared/enums";
import { SMSExpress } from "../Shared/ThirdPartyApi";

@Injectable()
export class SMSAuthService {
  constructor(private readonly sms: SMSExpress) {}

  async verifySMSToken(
    sms_token: string,
    verifyCode: string
  ): Promise<SMSAuthResult> {
    let smsTokenInfo = await getCustomRepository(
      SMSAuthRepository
    ).findOneToVerify(sms_token);
    //不存在或已驗證過
    if (!smsTokenInfo || smsTokenInfo.is_verified === true) {
      return {
        resultCode: ResultCode.SMS_TOKEN_EXPIRED,
        tokenInfo: smsTokenInfo
      };
    }
    //驗證碼錯誤
    if (smsTokenInfo.verify_code !== verifyCode) {
      return {
        resultCode: ResultCode.SMS_VERIFY_CODE_ERROR,
        tokenInfo: smsTokenInfo
      };
    }
    //成功更新為已驗證
    await getCustomRepository(SMSAuthRepository).setVerified(sms_token);
    return { resultCode: ResultCode.SUCCESS, tokenInfo: smsTokenInfo };
  }

  async createSMSToken(phone_number: string): Promise<string> {
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    let res = await getCustomRepository(SMSAuthRepository).createToken(
      phone_number,
      "123456"
    );
    //await 寄送簡訊 TODO
    //let smsexpress = new SMSExpress();
    let smsr = await this.sms.sendSMS(
      phone_number,
      res.sms_token,
      "您的樂坊簡訊驗證碼為:" + verifyCode
    );
    return res.sms_token;
  }
}

export class SMSAuthResult {
  resultCode: ResultCode;
  tokenInfo?: SMSAuth;
}
