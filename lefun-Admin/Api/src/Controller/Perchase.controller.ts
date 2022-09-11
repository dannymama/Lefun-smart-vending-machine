import { Get, Controller, Param, Req, Post, Body, Query } from "@nestjs/common";
import { PerchaseService } from "../Service/Perchase.service";
import {
  findDto,
  getPerchaseDto,
  createPerchaseDto
} from "../Dto/Perchase.dto";
import { getReturnObj, ResultCode, ReturnObj } from "../Shared/enums";
import { Request } from "express";
import { PerchaseLog } from "../Dao/models";
import { Hash } from "../Shared/hash";

@Controller("perchase")
export class PerchaseController {
  constructor(
    private readonly perchaseService: PerchaseService,
    private readonly hash: Hash
  ) {}

  @Get("to_invoice")
  async find(@Query() param: findDto): Promise<ReturnObj> {
    console.log(param);
    let { resultCode, perchaseInfo } = await this.perchaseService.findToInoivce(
      new Date(param.start_time),
      new Date(param.end_time)
    );
    return getReturnObj(resultCode, { perchaseInfo: perchaseInfo });
  }
}
