import { Injectable } from "@nestjs/common";
import { getCustomRepository, getManager, In } from "typeorm";
import { PerchaseLog, TransactionLog, BehaviorLog } from "../Dao/models";
import {
  UserRepository,
  PerchaseLogRepository,
  LefunTransactionRepository,
  TransactionLogRepository,
  BehaviorLogRepository,
  PaymentInfoRepository,
  ProductListRepository
} from "../Dao/repository";
import { ResultCode } from "../Shared/enums";
import { Tappay, ECPAYInvoice } from "../Shared/ThirdPartyApi";
@Injectable()
export class PerchaseService {
  constructor(private readonly taypay: Tappay) {}
  public async findBy_Limit_Offset(
    limit: number,
    offset: number,
    lefun_user_id: string
  ): Promise<PerchaseResult> {
    let user = await getCustomRepository(UserRepository).findOneById(
      lefun_user_id
    );
    if (!user) {
      return { resultCode: ResultCode.ACCOUNT_NOT_EXIST };
    }
    // let [perchaselogs, number] = await getCustomRepository(
    //   PerchaseLogRepository
    // ).findAndCount({
    //   where: { user: user },
    //   relations: ["lefunTransaction", "lefunTransaction.lefun_transaction_id"],
    //   order: {
    //     createdAt: "DESC"
    //   },
    //   skip: offset,
    //   take: limit
    // });

    let [perchaselogs, number] = await getCustomRepository(
      PerchaseLogRepository
    )
      .createQueryBuilder("PerchaseLog")
      .leftJoin("PerchaseLog.lefunTransaction", "LefunTransaction")
      .leftJoin("PerchaseLog.user", "User")
      .select([
        "PerchaseLog.amount",
        "PerchaseLog.device_name",
        "PerchaseLog.isPaid",
        "PerchaseLog.amount",
        "PerchaseLog.use_lefun_point",
        "PerchaseLog.createdAt",
        "PerchaseLog.product_list",
        "PerchaseLog.invoice_type",
        "LefunTransaction.lefun_transaction_id"
      ])
      .where("User.lefun_user_id = :id", { id: user.lefun_user_id })
      .offset(offset)
      .limit(limit)
      .orderBy("PerchaseLog.id", "DESC")
      .getManyAndCount();
    return {
      resultCode: ResultCode.SUCCESS,
      perchaseInfo: { perchaselogs: perchaselogs, number: number }
    };
  }

  // public find(): Promise<PerchaseLog[]> {
  //   return getCustomRepository(PerchaseLogRepository).find({
  //     order: { createdAt: "DESC" }
  //   });
  // }

  public async findOneByTransactionId(
    lefun_transaction_id: string
  ): Promise<PerchaseResult> {
    let lefuntrans = await getCustomRepository(
      LefunTransactionRepository
    ).findOneByID(lefun_transaction_id);
    let perchaseinfo = await getCustomRepository(
      PerchaseLogRepository
    ).findOneByLefunTransaction(lefuntrans);
    if (!perchaseinfo) {
      return { resultCode: ResultCode.PERCHASELOG_NOT_EXIST };
    }
    return { resultCode: ResultCode.SUCCESS, perchaseInfo: perchaseinfo };
  }

  public async createPerchaseLog(
    log: PerchaseLog,
    lefun_transaction_id: string,
    verify_token: string,
    product_list: string
  ): Promise<PerchaseResult> {
    let lefunTransactionInfo = await getCustomRepository(
      LefunTransactionRepository
    ).findOneVerified(lefun_transaction_id);

    if (!lefunTransactionInfo) {
      return {
        resultCode: ResultCode.LEFUN_TRANS_EXPIRED
      };
    }

    if (lefunTransactionInfo.verify_token !== verify_token) {
      return {
        resultCode: ResultCode.VERIFY_TOKEN_ERROR
      };
    }

    if (lefunTransactionInfo.device_id !== log.device_id) {
      return {
        resultCode: ResultCode.WRONG_DEVICE_ID
      };
    }
    let user = await getCustomRepository(UserRepository).findOneById(
      lefunTransactionInfo.user.lefun_user_id,
      ["paymentInfo"]
    );

    //計算rfid tag mapping 資訊
    const tag_ids = product_list.split(",");
    let productlist = await getCustomRepository(ProductListRepository).find({
      select: ["title", "memo", "price"],
      where: { tag_id: In(tag_ids) }
    });

    let product_amount = 0;
    for (let i = 0; i < productlist.length; i++) {
      product_amount = product_amount + productlist[i].price;
    }

    if (product_amount === 0) {
      return { resultCode: ResultCode.SUCCESS };
    }

    log.amount = product_amount;
    log.product_list = JSON.stringify(productlist);
    log.invoice_type = lefunTransactionInfo.invoice_type;

    let payByTokenResult = await this.taypay.payByToken(
      user.paymentInfo[0].taypay_secret,
      user.paymentInfo[0].taypay_token,
      log.amount,
      "消費," + lefunTransactionInfo.lefun_transaction_id
    );

    const Tlog = new TransactionLog();
    const behavior_log = new BehaviorLog();

    log.isPaid = true;
    if (payByTokenResult.status === 0) {
      Tlog.amount = payByTokenResult.amount;
      Tlog.auth_code = payByTokenResult.auth_code;
      Tlog.bank_transaction_id = payByTokenResult.bank_transaction_id;
      Tlog.currency = payByTokenResult.currency;
      Tlog.rec_trade_id = payByTokenResult.rec_trade_id;
      Tlog.memo = "消費";

      behavior_log.memo =
        "使用者消費," +
        payByTokenResult.amount +
        "元," +
        "訂單編號:" +
        lefunTransactionInfo.lefun_transaction_id;
      behavior_log.type = "PAYMENT";
    } else {
      //return { resultCode: ResultCode.TAPPAY_ERROR };
      await getCustomRepository(PaymentInfoRepository).setInvalid(
        user.paymentInfo[0].id
      );
      behavior_log.memo =
        "付款失敗 訂單編號:" + lefunTransactionInfo.lefun_transaction_id;
      behavior_log.type = "PAYMENT";
      log.isPaid = false;
    }

    // let invoiceRes = await this.ecapyinvoice.issue(
    //   user.user_name,
    //   payByTokenResult.amount.toString()
    // );

    await getManager().transaction(async manager => {
      Tlog.user = user;
      Tlog.lefunTransaction = lefunTransactionInfo;
      if (log.isPaid) {
        let transactionLog = await manager
          .getCustomRepository(TransactionLogRepository)
          .save(Tlog);
        log.transactionLog = transactionLog;
      }
      behavior_log.user = user;
      await manager
        .getCustomRepository(BehaviorLogRepository)
        .save(behavior_log);
      log.user = user;
      log.lefunTransaction = lefunTransactionInfo;
      log.use_lefun_point = lefunTransactionInfo.use_lefun_point;
      log.invoice_url = ""; //invoiceRes;

      await manager.getCustomRepository(PerchaseLogRepository).save(log);
      await manager
        .getCustomRepository(LefunTransactionRepository)
        .setFinished(lefun_transaction_id);
    });

    return { resultCode: ResultCode.SUCCESS };
  }
}

export class PerchaseResult {
  resultCode: ResultCode;
  perchaseInfo?: any;
}
