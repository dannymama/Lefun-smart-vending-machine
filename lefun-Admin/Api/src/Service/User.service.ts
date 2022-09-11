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

  public async getRegisterSumInPeriod(
    start_time: Date,
    end_time: Date
  ): Promise<Result> {
    let data = await getCustomRepository(UserRepository)
      .createQueryBuilder("User")
      .select([
        "CONVERT(DATE(User.createdAt),CHAR(10)) As date",
        "COUNT(User.createdAt) As count"
      ])
      .where("User.createdAt >= :start_time", {
        start_time: start_time
      })
      .andWhere("User.createdAt <= :end_time", {
        end_time: end_time
      })
      .groupBy("date")
      .getRawMany();
    console.log(data);
    return { resultCode: ResultCode.SUCCESS, data: data };
  }

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

  public findUserInfoByPhoneNum(phone_number: string): Promise<User> {
    return getCustomRepository(UserRepository).findOneByPhoneNum(phone_number, [
      "paymentInfo"
    ]);
  }

  public findUserInfoByUID(uid: string): Promise<User> {
    return getCustomRepository(UserRepository).findOneByUID(uid, [
      "paymentInfo"
    ]);
  }

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
    lefun_userid: string,
    verify_code: string,
    recover_code: string
  ): Promise<Result> {
    return await getManager().transaction(async manager => {
      let user = await getCustomRepository(UserRepository).findOneById(
        lefun_userid
      );

      if (user.recover_code !== recover_code) {
        return { resultCode: ResultCode.RECOVERY_CODE_ERROR };
      }
      await manager
        .getCustomRepository(UserRepository)
        .updateById(lefun_userid, { verify_code: verify_code });
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
}

export class RegisterResult {
  resultCode: ResultCode;
  userObj?: User;
}

export class Result {
  resultCode: ResultCode;
  data?: any;
}
