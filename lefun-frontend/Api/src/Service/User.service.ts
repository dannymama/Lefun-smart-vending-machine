import { Injectable } from "@nestjs/common";
import { getCustomRepository, getManager } from "typeorm";
import { User, PaymentInfo, BehaviorLog } from "../Dao/models";
import {
  UserRepository,
  SMSAuthRepository,
  BehaviorLogRepository,
  PaymentInfoRepository
} from "../Dao/repository";
import { ResultCode } from "../Shared/enums";
import { Tappay } from "../Shared/ThirdPartyApi";
import { VerifyService } from "./Verify.service";

@Injectable()
export class UserService {
  constructor(
    private readonly taypay: Tappay,
    private readonly verifyService: VerifyService
  ) {}
  //取得使用者公開資訊
  public findPublicInfoById(id: string): Promise<User> {
    return getCustomRepository(UserRepository)
      .createQueryBuilder()
      .innerJoin(
        "User.paymentInfo",
        "paymemtInfo",
        "User.lefun_user_id = :userid",
        {
          userid: id
        }
      )
      .select([
        "User.id",
        "User.phone_number",
        "User.user_name",
        "User.lefun_point",
        "User.openid_account",
        "User.mobile_device",
        "User.email",
        "User.invoice_type",
        "paymemtInfo.realname",
        "paymemtInfo.is_valid",
        "paymemtInfo.email",
        "paymemtInfo.taypay_last_four",
        "paymemtInfo.taypay_bin_code",
        "paymemtInfo.taypay_funding",
        "paymemtInfo.taypay_expiry_date"
      ])
      .getOne();
  }

  //透過sms建立帳號
  public async createBySMS(
    sms_token: string,
    prime: string,
    userInfo: User,
    paymentInfo: PaymentInfo
  ): Promise<RegisterResult> {
    //驗證簡訊驗證碼
    let { isSuccess, data } = await this.verifyService
      .getVerifyObj("SMS")
      .verify({ sms_token });
    if (!isSuccess) {
      return { resultCode: ResultCode.SMS_TOKEN_ERROR };
    }
    //確認手機號碼是否已被使用
    let user = await getCustomRepository(UserRepository).findOneByPhoneNum(
      data
    );
    if (user) {
      return { resultCode: ResultCode.PHONE_IS_USED };
    }
    //taypay 綁定信用卡
    let bindCardResult = await this.taypay.bindCard(prime);
    if (bindCardResult.status !== 0) {
      return { resultCode: ResultCode.TAPPAY_ERROR };
    }

    //驗證時的手機號
    userInfo.phone_number = data;
    //tappay綁卡資訊
    paymentInfo.taypay_token = bindCardResult.card_secret.card_token;
    paymentInfo.taypay_secret = bindCardResult.card_secret.card_key;
    paymentInfo.taypay_bin_code = bindCardResult.card_info.bin_code;
    paymentInfo.taypay_country = bindCardResult.card_info.country;
    paymentInfo.taypay_country_code = bindCardResult.card_info.country_code;
    paymentInfo.taypay_expiry_date = bindCardResult.card_info.expiry_date;
    paymentInfo.taypay_funding = bindCardResult.card_info.funding;
    paymentInfo.taypay_issuer = bindCardResult.card_info.issuer;
    paymentInfo.taypay_last_four = bindCardResult.card_info.last_four;
    paymentInfo.taypay_level = bindCardResult.card_info.level;
    paymentInfo.taypay_type = bindCardResult.card_info.type;
    //註冊紀錄
    const behavior_log = new BehaviorLog();
    behavior_log.memo = "註冊(SMS)";
    behavior_log.type = "REGISTER";
    //建立帳號
    let userCreated = await getManager().transaction(async manager => {
      let user = await manager
        .getCustomRepository(UserRepository)
        .save(userInfo);
      paymentInfo.user = user;
      await manager
        .getCustomRepository(PaymentInfoRepository)
        .save(paymentInfo);

      behavior_log.user = user;
      await manager
        .getCustomRepository(BehaviorLogRepository)
        .save(behavior_log);
      await manager.getCustomRepository(SMSAuthRepository).setUsed(sms_token);
      return user;
    });
    return { resultCode: ResultCode.SUCCESS, userObj: userCreated };
  }

  //透過fb建立帳號
  public async createByFacebook(
    fb_accesstoken: string,
    prime: string,
    userInfo: User,
    paymentInfo: PaymentInfo
  ): Promise<RegisterResult> {
    //驗證fb oauth token
    let { isSuccess, data } = await this.verifyService
      .getVerifyObj("Facebook")
      .verify({ fb_accesstoken });
    if (!isSuccess) {
      return { resultCode: ResultCode.FB_OAUTH_ERROR };
    }
    //確認fb帳號是否已被使用
    let openid_account = "FB-" + data;
    let user = await getCustomRepository(UserRepository).findOneByOpenID(
      openid_account
    );
    if (user) {
      return { resultCode: ResultCode.ACCOUNT_ALREADY_EXIST };
    }
    //taypay綁卡
    let taypay = new Tappay();
    let bindCardResult = await taypay.bindCard(prime);
    if (bindCardResult.status !== 0) {
      return { resultCode: ResultCode.TAPPAY_ERROR };
    }

    userInfo.openid_account = openid_account;
    //tappay綁卡資訊
    paymentInfo.taypay_token = bindCardResult.card_secret.card_token;
    paymentInfo.taypay_secret = bindCardResult.card_secret.card_key;
    paymentInfo.taypay_bin_code = bindCardResult.card_info.bin_code;
    paymentInfo.taypay_country = bindCardResult.card_info.country;
    paymentInfo.taypay_country_code = bindCardResult.card_info.country_code;
    paymentInfo.taypay_expiry_date = bindCardResult.card_info.expiry_date;
    paymentInfo.taypay_funding = bindCardResult.card_info.funding;
    paymentInfo.taypay_issuer = bindCardResult.card_info.issuer;
    paymentInfo.taypay_last_four = bindCardResult.card_info.last_four;
    paymentInfo.taypay_level = bindCardResult.card_info.level;
    paymentInfo.taypay_type = bindCardResult.card_info.type;
    //紀錄
    const behavior_log = new BehaviorLog();
    behavior_log.memo = "註冊(Facebook)";
    behavior_log.type = "REGISTER";
    //建立帳號
    let userCreated = await getManager().transaction(async manager => {
      let user = await manager
        .getCustomRepository(UserRepository)
        .save(userInfo);
      paymentInfo.user = user;
      await manager
        .getCustomRepository(PaymentInfoRepository)
        .save(paymentInfo);
      behavior_log.user = user;
      await manager
        .getCustomRepository(BehaviorLogRepository)
        .save(behavior_log);
      return user;
    });

    return { resultCode: ResultCode.SUCCESS, userObj: userCreated };
  }

  //透過google建立帳號
  public async createByGoogle(
    google_accesstoken: string,
    prime: string,
    userInfo: User,
    paymentInfo: PaymentInfo
  ): Promise<RegisterResult> {
    //驗證 google oauth token
    let { isSuccess, data } = await this.verifyService
      .getVerifyObj("Google")
      .verify({ google_accesstoken });
    if (!isSuccess) {
      return { resultCode: ResultCode.GOOGLE_OAUTH_ERROR };
    }
    //確認google帳號是否已被使用
    let openid_account = "G-" + data;
    let user = await getCustomRepository(UserRepository).findOneByOpenID(
      openid_account
    );
    if (user) {
      return { resultCode: ResultCode.ACCOUNT_ALREADY_EXIST };
    }

    //taypay綁卡
    let taypay = new Tappay();
    let bindCardResult = await taypay.bindCard(prime);

    if (bindCardResult.status !== 0) {
      return { resultCode: ResultCode.TAPPAY_ERROR };
    }

    userInfo.openid_account = openid_account;
    //tappay付款資訊
    paymentInfo.taypay_token = bindCardResult.card_secret.card_token;
    paymentInfo.taypay_secret = bindCardResult.card_secret.card_key;
    paymentInfo.taypay_bin_code = bindCardResult.card_info.bin_code;
    paymentInfo.taypay_country = bindCardResult.card_info.country;
    paymentInfo.taypay_country_code = bindCardResult.card_info.country_code;
    paymentInfo.taypay_expiry_date = bindCardResult.card_info.expiry_date;
    paymentInfo.taypay_funding = bindCardResult.card_info.funding;
    paymentInfo.taypay_issuer = bindCardResult.card_info.issuer;
    paymentInfo.taypay_last_four = bindCardResult.card_info.last_four;
    paymentInfo.taypay_level = bindCardResult.card_info.level;
    paymentInfo.taypay_type = bindCardResult.card_info.type;
    //紀錄
    const behavior_log = new BehaviorLog();
    behavior_log.memo = "註冊(Google)";
    behavior_log.type = "REGISTER";
    //建立帳號
    let userCreated = await getManager().transaction(async manager => {
      let user = await manager
        .getCustomRepository(UserRepository)
        .save(userInfo);
      paymentInfo.user = user;
      await manager
        .getCustomRepository(PaymentInfoRepository)
        .save(paymentInfo);
      behavior_log.user = user;
      await manager
        .getCustomRepository(BehaviorLogRepository)
        .save(behavior_log);
      return user;
    });
    return { resultCode: ResultCode.SUCCESS, userObj: userCreated };
  }

  // public async createByAccount(
  //   user_account: string,
  //   user_password: string,
  //   prime: string,
  //   userInfo: User,
  //   paymentInfo: PaymentInfo
  // ): Promise<RegisterResult> {
  //   let user = await getCustomRepository(UserRepository).findOneByAccount(
  //     user_account
  //   );
  //   if (user) {
  //     return { resultCode: ResultCode.ACCOUNT_ALREADY_EXIST };
  //   }

  //   //taypay一元付款確認該信用卡資訊
  //   let taypay = new Tappay();
  //   let bindCardResult = await taypay.bindCard(prime);
  //   if (bindCardResult.status !== 0) {
  //     return { resultCode: ResultCode.TAPPAY_ERROR };
  //   }

  //   userInfo.user_password = bcrypt.hashSync(user_password);
  //   userInfo.user_account = user_account;
  //   //tappay付款資訊
  //   paymentInfo.taypay_token = bindCardResult.card_secret.card_token;
  //   paymentInfo.taypay_secret = bindCardResult.card_secret.card_key;
  //   paymentInfo.taypay_bin_code = bindCardResult.card_info.bin_code;
  //   paymentInfo.taypay_country = bindCardResult.card_info.country;
  //   paymentInfo.taypay_country_code = bindCardResult.card_info.country_code;
  //   paymentInfo.taypay_expiry_date = bindCardResult.card_info.expiry_date;
  //   paymentInfo.taypay_funding = bindCardResult.card_info.funding;
  //   paymentInfo.taypay_issuer = bindCardResult.card_info.issuer;
  //   paymentInfo.taypay_last_four = bindCardResult.card_info.last_four;
  //   paymentInfo.taypay_level = bindCardResult.card_info.level;
  //   paymentInfo.taypay_type = bindCardResult.card_info.type;

  //   const behavior_log = new BehaviorLog();
  //   behavior_log.memo = "使用者註冊";
  //   behavior_log.type = "REGISTER";

  //   let userCreated = await getManager().transaction(async manager => {
  //     let user = await manager
  //       .getCustomRepository(UserRepository)
  //       .save(userInfo);
  //     paymentInfo.user = user;
  //     await manager
  //       .getCustomRepository(PaymentInfoRepository)
  //       .save(paymentInfo);
  //     behavior_log.user = user;
  //     await manager
  //       .getCustomRepository(BehaviorLogRepository)
  //       .save(behavior_log);
  //     return user;
  //   });

  //   return { resultCode: ResultCode.SUCCESS, userObj: userCreated };
  // }

  //修改使用者名稱
  public async updateUserNameById(
    lefun_userid: string,
    user_name: string
  ): Promise<void> {
    await getManager().transaction(async manager => {
      let user = await manager
        .getCustomRepository(UserRepository)
        .findOneById(lefun_userid);
      await manager
        .getCustomRepository(UserRepository)
        .updateById(lefun_userid, { user_name: user_name });
      let behavior_log = new BehaviorLog();
      behavior_log.memo =
        "更改使用者名稱: " + user.user_name + "=>" + user_name;
      behavior_log.type = "UPDATE";
      behavior_log.user = user;
      await manager
        .getCustomRepository(BehaviorLogRepository)
        .save(behavior_log);
    });
  }

  public async updateUserVerifyCodeById(
    lefun_user_id: string,
    verify_code: string,
    recover_code: string
  ): Promise<Result> {

    return await getManager().transaction(async manager => {
      let user = await getCustomRepository(UserRepository).findOneById(
        lefun_user_id
      );
  
      if (user.recover_code !== recover_code) {
        return { resultCode: ResultCode.RECOVERY_CODE_ERROR };
      }
      await manager
        .getCustomRepository(UserRepository)
        .updateById(lefun_user_id, { verify_code: verify_code });
      let behavior_log = new BehaviorLog();
      behavior_log.memo = "更改安全密碼";
      behavior_log.type = "UPDATE";
      behavior_log.user = user;
      await manager
        .getCustomRepository(BehaviorLogRepository)
        .save(behavior_log);

      return { resultCode: ResultCode.SUCCESS };
    });
  }

  //檢查使用者復原密碼
  public async checkUserVerifyCodeById(
    lefun_user_id:string,
    recover_code: string
  ): Promise<Result> {

    let user = await getCustomRepository(UserRepository).findOneById(
      lefun_user_id
    );

    if (user.recover_code !== recover_code) {
      return { resultCode: ResultCode.RECOVERY_CODE_ERROR };
    }
    return { resultCode: ResultCode.SUCCESS };
    
  }

  //修改使用者發票
  public async updateInvoiceTypeById(
    lefun_userid: string,
    updateObj: User
  ): Promise<boolean> {
    if (updateObj.invoice_type === 1 && !updateObj.mobile_device) {
      return false;
    }
    if (updateObj.invoice_type === 2 && !updateObj.email) {
      return false;
    }
    await getManager().transaction(async manager => {
      let user = await manager
        .getCustomRepository(UserRepository)
        .findOneById(lefun_userid);
      let updated = Object.assign(user, updateObj);
      await manager.getCustomRepository(UserRepository).save(updated);
      let behavior_log = new BehaviorLog();
      behavior_log.memo =
        "更改電子發票類型: " +
        user.invoice_type +
        "=>" +
        updateObj.invoice_type;
      behavior_log.type = "UPDATE";
      behavior_log.user = user;
      await manager
        .getCustomRepository(BehaviorLogRepository)
        .save(behavior_log);
    });
    return true;
  }
  //更換信用卡
  public async updateUserPaymentById(
    lefun_userid: string,
    prime: string
  ): Promise<Result> {
    return await getManager().transaction(async manager => {
      let user = await manager
        .getCustomRepository(UserRepository)
        .findOneById(lefun_userid, ["paymentInfo"]);
      let old_cardToken = user.paymentInfo[0].taypay_token;
      let old_cardSecret = user.paymentInfo[0].taypay_secret;
      let paymentID = user.paymentInfo[0].id;
      let updateObj = new PaymentInfo();

      let taypay = new Tappay();
      let bindCardResult = await taypay.bindCard(prime);
      if (bindCardResult.status !== 0) {
        return { resultCode: ResultCode.TAPPAY_ERROR };
      }

      //tappay付款資訊
      updateObj.taypay_token = bindCardResult.card_secret.card_token;
      updateObj.taypay_secret = bindCardResult.card_secret.card_key;
      updateObj.taypay_bin_code = bindCardResult.card_info.bin_code;
      updateObj.taypay_country = bindCardResult.card_info.country;
      updateObj.taypay_country_code = bindCardResult.card_info.country_code;
      updateObj.taypay_expiry_date = bindCardResult.card_info.expiry_date;
      updateObj.taypay_funding = bindCardResult.card_info.funding;
      updateObj.taypay_issuer = bindCardResult.card_info.issuer;
      updateObj.taypay_last_four = bindCardResult.card_info.last_four;
      updateObj.taypay_level = bindCardResult.card_info.level;
      updateObj.taypay_type = bindCardResult.card_info.type;
      updateObj.is_valid = true;

      await manager
        .getCustomRepository(PaymentInfoRepository)
        .updateById(paymentID, updateObj);
      let behavior_log = new BehaviorLog();
      behavior_log.memo =
        "更換信用卡 (token: " +
        old_cardToken +
        ", secret:" +
        old_cardSecret +
        ") => (token: " +
        updateObj.taypay_token +
        ", secret:" +
        updateObj.taypay_secret +
        ")";
      behavior_log.type = "UPDATE";
      behavior_log.user = user;
      await manager
        .getCustomRepository(BehaviorLogRepository)
        .save(behavior_log);

      return { resultCode: ResultCode.SUCCESS };
    });
  }

  // public async updateVerifyCodeById(
  //   lefun_userid: string,
  //   verify_code: string
  // ): Promise<UpdateResult> {
  //   return getCustomRepository(UserRepository).updateById(lefun_userid, {
  //     verify_code: verify_code
  //   });
  // }
}

export class RegisterResult {
  resultCode: ResultCode;
  userObj?: User;
}

export class Result {
  resultCode: ResultCode;
}
