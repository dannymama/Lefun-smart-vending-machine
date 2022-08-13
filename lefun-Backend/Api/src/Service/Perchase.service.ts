import { Injectable } from "@nestjs/common";
import { getCustomRepository, getManager } from "typeorm";
import { PerchaseLog, TransactionLog, BehaviorLog } from "../Dao/models";
import {
  UserRepository,
  PerchaseLogRepository,
  LefunTransactionRepository,
  TransactionLogRepository,
  BehaviorLogRepository,
  PaymentInfoRepository
} from "../Dao/repository";
import { ResultCode } from "../Shared/enums";
import { Tappay, ECPAYInvoice } from "../Shared/ThirdPartyApi";

@Injectable()
export class PerchaseService {
  constructor(
    private readonly taypay: Tappay,
    private readonly ecapyinvoice: ECPAYInvoice
  ) {}
  public async findbyPhoneNum(
    phone_number: string,
    limit: number,
    offset: number,
    start_time: Date,
    end_time: Date
  ): Promise<Result> {
    let user = await getCustomRepository(UserRepository).findOneByPhoneNum(
      phone_number
    );
    if (!user) {
      return { resultCode: ResultCode.ACCOUNT_NOT_EXIST };
    }

    let data = await getCustomRepository(PerchaseLogRepository)
      .createQueryBuilder("PerchaseLog")
      .leftJoin("PerchaseLog.lefunTransaction", "LefunTransaction")
      .leftJoin("PerchaseLog.transactionLog", "TransactionLog")
      .select([
        "PerchaseLog.amount",
        "PerchaseLog.device_name",
        "PerchaseLog.isPaid",
        "PerchaseLog.product_list",
        "PerchaseLog.amount",
        "PerchaseLog.use_lefun_point",
        "PerchaseLog.createdAt",
        "LefunTransaction.lefun_transaction_id",
        "TransactionLog.rec_trade_id"
      ])
      .where({ user: user })
      .andWhere("PerchaseLog.createdAt >= :start_time", {
        start_time: start_time
      })
      .andWhere("PerchaseLog.createdAt <= :end_time", {
        end_time: end_time
      })
      .limit(limit)
      .offset(offset)
      .getManyAndCount();
    return { resultCode: ResultCode.SUCCESS, data: data };
  }

  // public find(): Promise<PerchaseLog[]> {
  //   return getCustomRepository(PerchaseLogRepository).find({
  //     order: { createdAt: "DESC" }
  //   });
  // }

  public async findToInoivce(
    start_time: Date,
    end_time: Date
  ): Promise<PerchaseResult> {
    let perchaseinfo = await getCustomRepository(PerchaseLogRepository)
      .createQueryBuilder("PerchaseLog")
      .leftJoin("PerchaseLog.lefunTransaction", "LefunTransaction")
      .leftJoin("LefunTransaction.transactionLog", "TransactionLog")
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
        "LefunTransaction.lefun_transaction_id",
        "TransactionLog.rec_trade_id",
        "User.phone_number",
        "User.invoice_type",
        "User.mobile_device",
        "User.email",
        "User.user_name"
      ])
      .where("isPaid = 1")
      .andWhere("PerchaseLog.createdAt >= :start_time", {
        start_time: start_time
      })
      .andWhere("PerchaseLog.createdAt <= :end_time", {
        end_time: end_time
      })
      .orderBy("PerchaseLog.id", "DESC")
      .getMany();

    return { resultCode: ResultCode.SUCCESS, perchaseInfo: perchaseinfo };
  }
}

export class PerchaseResult {
  resultCode: ResultCode;
  perchaseInfo?: any;
}

export class Result {
  resultCode: ResultCode;
  data?: [PerchaseLog[], number];
}
