import { Injectable } from "@nestjs/common";
import { getCustomRepository, getManager } from "typeorm";
import { BehaviorLog } from "../Dao/models";
import {
  LefunTransactionRepository,
  UserRepository,
  BehaviorLogRepository
} from "../Dao/repository";
import { ResultCode } from "../Shared/enums";
import { ECPAYInvoice } from "../Shared/ThirdPartyApi";
import * as querystring from "querystring";

@Injectable()
export class LefunTransactionService {
  constructor(private readonly ecapyinvoice: ECPAYInvoice) {}

  public async createTransaction(
    lefun_user_id: string,
    verifyCode: string
  ): Promise<LefunTransactionResult> {
    let user = await getCustomRepository(UserRepository).findOneById(
      lefun_user_id,
      ["paymentInfo"]
    );
    //不存在
    if (!user) {
      return {
        resultCode: ResultCode.ACCOUNT_NOT_EXIST
      };
    }
    //驗證碼錯誤
    if (user.verify_code !== verifyCode) {
      return {
        resultCode: ResultCode.VERIFY_CODE_ERROR
      };
    }

    if (!user.paymentInfo[0].is_valid) {
      return {
        resultCode: ResultCode.PAYMENT_INVALID
      };
    }

    //建立樂坊訂單
    let lefunTransInfo = await getCustomRepository(
      LefunTransactionRepository
    ).createTransaction(user);
    return {
      resultCode: ResultCode.SUCCESS,
      lefunTransactionInfo: lefunTransInfo
    };
  }

  public async verifyTransaction(
    lefun_transaction_id: string,
    device_id: string,
    device_name: string,
    usePoint: string
  ): Promise<LefunTransactionResult> {
    let lefunTransactionInfo = await getCustomRepository(
      LefunTransactionRepository
    ).findOneByID(lefun_transaction_id);
    //不存在或已驗證過
    if (!lefunTransactionInfo || lefunTransactionInfo.is_verified === true) {
      return {
        resultCode: ResultCode.LEFUN_TRANS_EXPIRED
      };
    }
    //成功更新為已驗證
    let use_lefun_point = usePoint === "1" ? true : false;
    const behavior_log = new BehaviorLog();
    behavior_log.memo = "開門";
    behavior_log.type = "OPENDOOR";
    behavior_log.user = lefunTransactionInfo.user;
    await getManager().transaction(async manager => {
      await manager
        .getCustomRepository(LefunTransactionRepository)
        .setVerifiedAndUpdate(
          lefun_transaction_id,
          use_lefun_point,
          device_id,
          device_name
        );
      await manager
        .getCustomRepository(BehaviorLogRepository)
        .save(behavior_log);
    });
    return {
      resultCode: ResultCode.SUCCESS,
      lefunTransactionInfo: lefunTransactionInfo
    };
  }

  public async getTransaction(
    lefun_transaction_id: string,
    lefun_user_id: string
  ): Promise<LefunTransactionResult> {
    let lefunTransactionInfo = await getCustomRepository(
      LefunTransactionRepository
    ).findOneByID(lefun_transaction_id);
    if (!lefunTransactionInfo) {
      return {
        resultCode: ResultCode.LEFUN_TRANS_EXPIRED
      };
    }
    if (lefunTransactionInfo.user.lefun_user_id !== lefun_user_id) {
      return {
        resultCode: ResultCode.LEFUN_TRANS_EXPIRED
      };
    }
    return {
      resultCode: ResultCode.SUCCESS,
      lefunTransactionInfo: lefunTransactionInfo
    };
  }
  public async getTransactionInvoiceDetail(
    lefun_transaction_id: string
  ): Promise<any> {
    let { res, invoiceUrl } = await this.ecapyinvoice.query_issue(
      lefun_transaction_id
    );
    let resObj = querystring.parse(res);
    if (resObj.RtnCode !== "1") {
      return {
        resultCode: ResultCode.INVOICE_NOT_EXIST
      };
    }
    return {
      resultCode: ResultCode.SUCCESS,
      data: { resObj, invoiceUrl }
    };
  }
}

export class LefunTransactionResult {
  resultCode: ResultCode;
  lefunTransactionInfo?: any;
}
