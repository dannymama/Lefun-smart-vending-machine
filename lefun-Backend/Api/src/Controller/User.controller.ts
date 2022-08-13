import { Get, Post, Controller, Req, Body, Put, Param } from "@nestjs/common";
import { UserService } from "../Service/User.service";
import { BehaviorLogService } from "../Service/BehaviorLog.service";
import { PerchaseService } from "../Service/Perchase.service";

import {
  UpdateUserNameDto,
  FindUserByPhoneNumDto,
  findBehaviorLogByPhoneNumDto,
  findTransactionLogByPhoneNumDto,
  getRegisterSumInPeriodDto
} from "../Dto/User.dto";
import { getReturnObj, ResultCode, ReturnObj } from "../Shared/enums";
import { Request } from "express";
import { User, PaymentInfo } from "../Dao/models";
import { v4 } from "uuid";
import { HttpException } from "@nestjs/common/exceptions/http.exception";

@Controller("lefun_user")
export class UserController {
  private user: User;
  constructor(
    private readonly userService: UserService,
    private readonly behaviorService: BehaviorLogService,
    private readonly perchaseService: PerchaseService
  ) {
    this.user = new User();
  }

  @Get(":phone_number")
  async getUserInfo(
    @Req() req: Request,
    @Param() param: FindUserByPhoneNumDto
  ): Promise<ReturnObj> {
    let userInfo = await this.userService.findUserInfoByPhoneNum(
      param.phone_number
    );
    if (!userInfo) {
      return getReturnObj(ResultCode.ACCOUNT_NOT_EXIST);
    }
    return getReturnObj(ResultCode.SUCCESS, { userInfo: userInfo });
  }

  @Get("behavior_log/:phone_number/:limit/:offset/:start_time/:end_time")
  async getUserBehaviorLog(
    @Req() req: Request,
    @Param() param: findBehaviorLogByPhoneNumDto
  ): Promise<ReturnObj> {
    let { resultCode, data } = await this.behaviorService.findbyPhoneNum(
      param.phone_number,
      param.limit,
      param.offset,
      new Date(param.start_time),
      new Date(param.end_time)
    );
    let returnObj = {};
    if (resultCode === ResultCode.SUCCESS) {
      returnObj = { logs: data[0], count: data[1] };
    }
    return getReturnObj(resultCode, returnObj);
  }

  @Get("perchase_log/:phone_number/:limit/:offset/:start_time/:end_time")
  async getUserTransactionLog(
    @Req() req: Request,
    @Param() param: findTransactionLogByPhoneNumDto
  ): Promise<ReturnObj> {
    let { resultCode, data } = await this.perchaseService.findbyPhoneNum(
      param.phone_number,
      param.limit,
      param.offset,
      new Date(param.start_time),
      new Date(param.end_time)
    );
    let returnObj = {};
    if (resultCode === ResultCode.SUCCESS) {
      returnObj = { logs: data[0], count: data[1] };
    }
    return getReturnObj(resultCode, returnObj);
  }

  @Put("username")
  async updateUserNameByID(
    @Req() req: Request,
    @Body() param: UpdateUserNameDto
  ): Promise<ReturnObj> {
    await this.userService.updateUserNameById(req.user.userid, param.user_name);
    return getReturnObj(ResultCode.SUCCESS);
  }

  @Get("registers/:start_time/:end_time")
  async getRegisterSumInPeriod(
    @Req() req: Request,
    @Param() param: getRegisterSumInPeriodDto
  ): Promise<ReturnObj> {
    let { resultCode, data } = await this.userService.getRegisterSumInPeriod(
      new Date(param.start_time),
      new Date(param.end_time)
    );
    let returnObj = {};
    if (resultCode === ResultCode.SUCCESS) {
      returnObj = data;
    }
    return getReturnObj(resultCode, returnObj);
  }
}
