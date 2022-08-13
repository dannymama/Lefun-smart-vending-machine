import { Injectable } from "@nestjs/common";
import { getCustomRepository, Between } from "typeorm";
import { BehaviorLog } from "../Dao/models";
import { BehaviorLogRepository, UserRepository } from "../Dao/repository";
import { ResultCode } from "../Shared/enums";

@Injectable()
export class BehaviorLogService {
  constructor() {}

  async findbyPhoneNum(
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
    let data = await getCustomRepository(BehaviorLogRepository).findAndCount({
      select: ["id", "type", "memo", "createdAt"],
      order: {
        createdAt: "DESC"
      },
      where: { user: user, createdAt: Between(start_time, end_time) },
      skip: offset,
      take: limit
    });
    return { resultCode: ResultCode.SUCCESS, data: data };
  }
}
export class Result {
  resultCode: ResultCode;
  data?: [BehaviorLog[], number];
}
