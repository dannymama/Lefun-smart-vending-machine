import { Get, Controller, Req, Post, Body, Query } from "@nestjs/common";
import { LefunTransactionService } from "../Service/LefunTransaction.service";
import {
  createLefunTransactionDto,
  getLefunTransactionDto,
  verifyLefunTransactionDto
} from "../Dto/LefunTransaction.dto";
import { getReturnObj, ResultCode, ReturnObj } from "../Shared/enums";
import { Hash } from "../Shared/hash";
import { Request } from "express";
import { ApiOperation } from "@nestjs/swagger";

@Controller("lefunTrans")
export class LefunTransController {
  constructor(
    private readonly lefunTransService: LefunTransactionService,
    private readonly hash: Hash
  ) {}

  //建立交易訂單
  @Post()
  @ApiOperation({
    title: "建立訂單",
    description: "建立樂坊交易訂單，用於產生開門qrcode"
  })
  async createTransaction(
    @Req() req: Request,
    @Body() param: createLefunTransactionDto
  ): Promise<ReturnObj> {
    let {
      resultCode,
      lefunTransactionInfo
    } = await this.lefunTransService.createTransaction(
      req.user.userid,
      param.verifyCode
    );
    let data = {};
    if (resultCode === ResultCode.SUCCESS) {
      data = {
        lefun_transaction_id: lefunTransactionInfo.lefun_transaction_id
      };
    }
    return getReturnObj(resultCode, data);
  }

  //取得交易訂單資訊
  @Get()
  @ApiOperation({
    title: "取得訂單",
    description: "取得樂坊交易訂單資訊"
  })
  async getTransaction(
    @Req() req: Request,
    @Query() param: getLefunTransactionDto
  ): Promise<ReturnObj> {
    let {
      resultCode,
      lefunTransactionInfo
    } = await this.lefunTransService.getTransaction(
      param.lefun_transaction_id,
      req.user.userid
    );
    let data = {};
    if (resultCode === ResultCode.SUCCESS) {
      data = {
        lefunTransactionInfo: lefunTransactionInfo
      };
    }
    return getReturnObj(resultCode, data);
  }

  //驗證來源訂單資訊(冰箱端)
  @Post("verify")
  @ApiOperation({
    title: "驗證樂坊訂單",
    description: "驗證樂坊訂單，驗證成功後回應冰箱可開門"
  })
  async verifyTransaction(
    @Body() param: verifyLefunTransactionDto
  ): Promise<ReturnObj> {
    let hashResult = await this.hash.md5Salt(param.lefun_transaction_id);
    if (hashResult !== param.checksum) {
      return getReturnObj(ResultCode.CHECKSUM_NOT_VALID);
    }

    let {
      resultCode,
      lefunTransactionInfo
    } = await this.lefunTransService.verifyTransaction(
      param.lefun_transaction_id,
      param.device_id,
      param.device_name,
      param.usePoint
    );
    let data = {};
    if (resultCode === ResultCode.SUCCESS) {
      data = {
        verify_token: lefunTransactionInfo.verify_token
      };
    }
    return getReturnObj(resultCode, data);
  }

  //提供串接廠商產生qrcode測試用
  /* @Get("qrcode")
  async createTransactionForTesting(): Promise<ReturnObj> {
    let {
      resultCode,
      lefunTransactionInfo
    } = await this.lefunTransService.createTransaction(
      "4834e2716e2d4cb6bc08fa83e0841943",
      "111111"
    );

    let data = {};
    if (resultCode === ResultCode.SUCCESS) {
      data = {
        lefun_transaction_id: lefunTransactionInfo.lefun_transaction_id
      };
    }
    return getReturnObj(resultCode, data);
  }*/

  //取得訂單發票資訊 暫不使用
  /*@Get("invoice_detail/:lefun_transaction_id")
  async getTransactionInvoiceDetail(
    @Req() req: Request,
    @Param() param: getLefunTransactionDto
  ): Promise<ReturnObj> {
    let { resultCode } = await this.lefunTransService.getTransaction(
      param.lefun_transaction_id,
      req.user.userid
    );

    if (resultCode !== ResultCode.SUCCESS) {
      return getReturnObj(resultCode);
    }
    let invoiceData = {};
    let {
      resultCode: res,
      data
    } = await this.lefunTransService.getTransactionInvoiceDetail(
      param.lefun_transaction_id
    );

    if (res === ResultCode.SUCCESS) {
      invoiceData = data;
    }
    return getReturnObj(res, invoiceData);
  }*/
}
