import { Get, Controller, Param, Req, Post, Body } from "@nestjs/common";
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
import { ApiOperation } from "@nestjs/swagger";

@Controller("perchase")
export class PerchaseController {
  constructor(
    private readonly perchaseService: PerchaseService,
    private readonly hash: Hash
  ) {}

  @Get(":id")
  @ApiOperation({
    title: "取得特定單號交易資訊",
    description: "取得特定交易單號細部資訊"
  })
  async find(@Param() param: findDto): Promise<ReturnObj> {
    let {
      resultCode,
      perchaseInfo
    } = await this.perchaseService.findOneByTransactionId(param.id);
    return getReturnObj(resultCode, { perchaseInfo: perchaseInfo });
  }

  @Get(":limit/:offset")
  @ApiOperation({
    title: "取得所有交易紀錄",
    description: "取得所有交易紀錄"
  })
  async findAll(
    @Req() req: Request,
    @Param() param: getPerchaseDto
  ): Promise<ReturnObj> {
    const {
      resultCode,
      perchaseInfo
    } = await this.perchaseService.findBy_Limit_Offset(
      param.limit,
      param.offset,
      req.user.userid
    );
    return getReturnObj(resultCode, perchaseInfo);
  }

  @Post()
  @ApiOperation({
    title: "新增交易紀錄",
    description: "提供冰箱關門後呼叫，紀錄冰箱回傳資訊，新增交易紀錄"
  })
  async create(@Body() param: createPerchaseDto): Promise<ReturnObj> {
    let perchaselog = new PerchaseLog();
    perchaselog.device_id = param.device_id;
    perchaselog.device_name = param.device_name;
    let hashResult = await this.hash.md5Salt(param.lefun_transaction_id);
    if (hashResult !== param.checksum) {
      return getReturnObj(ResultCode.CHECKSUM_NOT_VALID);
    }

    let { resultCode } = await this.perchaseService.createPerchaseLog(
      perchaselog,
      param.lefun_transaction_id,
      param.verify_token,
      param.product_list
    );
    return getReturnObj(resultCode);
  }
}
