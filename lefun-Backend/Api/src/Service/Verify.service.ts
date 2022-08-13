import { Injectable } from "@nestjs/common";
import { getCustomRepository } from "typeorm";
import { SMSAuthRepository } from "../Dao/repository";
import { FacebookApi, GoogleApi } from "../Shared/ThirdPartyApi";
import * as bcrypt from "bcrypt-nodejs";

@Injectable()
export class VerifyService {
  public getVerifyObj(type: string) {
    switch (type) {
      case "Account": {
        return new VeirfyByAccountPassword();
      }
      case "SMS": {
        return new VeirfyBySMS();
      }
      case "Facebook": {
        return new VerifyByFaceboook();
      }
      case "Google": {
        return new VerifyByGoogle();
      }
      default: {
        return null;
      }
    }
  }
}

export interface AbstractVerify {
  verify(param?: any): Promise<VerifyResult>;
}

export class VeirfyByAccountPassword implements AbstractVerify {
  async verify(param?: any) {
    if (!bcrypt.compareSync(param.input_password, param.user_password)) {
      return { isSuccess: false };
    }
    return { isSuccess: true, data: "" };
  }
}

export class VeirfyBySMS implements AbstractVerify {
  async verify(param?: any) {
    let tokeninfo = await getCustomRepository(SMSAuthRepository).findOneToUse(
      param.sms_token
    );
    //不存在或尚未驗證
    if (!tokeninfo || tokeninfo.is_verified === false) {
      return { isSuccess: false };
    }
    return { isSuccess: true, data: tokeninfo.phone_number };
  }
}

export class VerifyByFaceboook implements AbstractVerify {
  async verify(param?: any) {
    try {
      //驗證fb accesstoken
      let facebookApi = new FacebookApi();
      let fbOauth_Result = await facebookApi.verifyAccessToken(
        param.fb_accesstoken
      );
      if (fbOauth_Result.status !== 200) {
        return { isSuccess: false };
      }
      return { isSuccess: true, data: fbOauth_Result.data.id };
    } catch (err) {
      return { isSuccess: false };
    }
  }
}

export class VerifyByGoogle implements AbstractVerify {
  async verify(param?: any) {
    try {
      //驗證fb accesstoken
      let googleApi = new GoogleApi();
      let { isSuccess, userid } = await googleApi.verifyAccessToken(
        param.google_accesstoken
      );
      if (isSuccess !== 1) {
        return { isSuccess: false };
      }
      return { isSuccess: true, data: userid };
    } catch (err) {
      return { isSuccess: false };
    }
  }
}

export class VerifyResult {
  isSuccess: boolean;
  data?: string;
}
