import { Get, Controller, Param, Req, Post, Body, Query } from "@nestjs/common";
import { LefunTransactionService } from "../Service/LefunTransaction.service";
import {
  createLefunTransactionDto,
  getLefunTransactionDto,
  verifyLefunTransactionDto
} from "../Dto/LefunTransaction.dto";
import { getReturnObj, ResultCode, ReturnObj } from "../Shared/enums";
import { Hash } from "../Shared/hash";
import { Request } from "express";

@Controller("lefunTrans")
export class LefunTransController {
  constructor(
    private readonly lefunTransService: LefunTransactionService,
    private readonly hash: Hash
  ) {}
  @Get("invoice_detail")
  async getTransactionInvoiceDetail(
    @Query() param: getLefunTransactionDto
  ): Promise<ReturnObj> {
    let {
      resultCode,
      data
    } = await this.lefunTransService.getTransactionInvoiceDetail(
      param.lefun_transaction_id
    );
    let invoiceData = {};
    if (resultCode === ResultCode.SUCCESS) {
      invoiceData = data;
    }
    return getReturnObj(resultCode, invoiceData);
  }
}
