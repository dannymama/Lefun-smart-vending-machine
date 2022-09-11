import {
  Get,
  Post,
  Controller,
  Req,
  Body,
  Put,
  HttpStatus,
  Query
} from "@nestjs/common";
import { UserService } from "../Service/User.service";
import { LoginInfoService } from "../Service/LoginInfo.service";
import {
  CreateUserBySMSDto,
  UpdateUserNameDto,
  UpdateVerifyCodeDto,
  UpdateUserPaymentDto,
  UpdateUserInvoiceDeviceDto,
  UpdateUserInvoiceEmailDto,
  CheckRecoverCodeDto
} from "../Dto/User.dto";
import { getReturnObj, ResultCode, ReturnObj } from "../Shared/enums";
import { Request } from "express";
import { User, PaymentInfo } from "../Dao/models";
import { v4 } from "uuid";
import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { ApiOperation } from "@nestjs/swagger";

@Controller("user")
export class UserController {
  private user: User;
  constructor(
    private readonly userService: UserService,
    private readonly loginInfoService: LoginInfoService
  ) {
    this.user = new User();
  }

  @Get("me")
  @ApiOperation({
    title: "取得使用者資訊",
    description: "取得當前登入使用者資訊"
  })
  async me(@Req() req: Request): Promise<ReturnObj> {
    let userInfo = await this.userService.findPublicInfoById(req.user.userid);
    if (!userInfo) {
      return getReturnObj(ResultCode.ACCOUNT_NOT_EXIST);
    }
    return getReturnObj(ResultCode.SUCCESS, { userInfo: userInfo });
  }

  @Post("sms")
  @ApiOperation({
    title: "新增使用者(SMS)",
    description: "透過簡訊註冊新使用者帳號"
  })
  async createBySMS(@Body() param: CreateUserBySMSDto): Promise<ReturnObj> {
    const lefun_userid = v4().replace(/-/g, "");

    this.user.user_name = param.user_name;
    this.user.lefun_user_id = lefun_userid;
    this.user.verify_code = param.verify_code;
    this.user.recover_code = param.recover_code;

    const payment = new PaymentInfo();
    payment.email = param.email;
    payment.realname = param.realname;

    let { resultCode, userObj } = await this.userService.createBySMS(
      param.sms_token,
      param.prime,
      this.user,
      payment
    );
    let data = {};
    if (resultCode === ResultCode.SUCCESS) {
      let token = await this.loginInfoService.createToken(userObj);
      data = { login_token: token };
    }
    return getReturnObj(resultCode, data);
  }

  @Put("username")
  @ApiOperation({
    title: "修改使用者名稱",
    description: "修改使用者名稱"
  })
  async updateUserNameByID(
    @Req() req: Request,
    @Body() param: UpdateUserNameDto
  ): Promise<ReturnObj> {
    await this.userService.updateUserNameById(req.user.userid, param.user_name);
    return getReturnObj(ResultCode.SUCCESS);
  }

  @Put("verifycode")
  @ApiOperation({
    title: "修改交易密碼",
    description: "修改交易密碼"
  })
  async updateVerifyCodeByID(
    @Req() req: Request,
    @Body() param: UpdateVerifyCodeDto
  ): Promise<ReturnObj> {
    let { resultCode } = await this.userService.updateUserVerifyCodeById(
      req.user.userid,
      param.verify_code,
      param.recover_code
    );
    return getReturnObj(resultCode);
  }

  @Get("recover")
  @ApiOperation({
    title: "驗證還原密碼",
    description: "驗證使用者輸入之還原密碼是否正確"
  })
  async checkVerifyCodeByID(
    @Req() req: Request,
    @Query() param: CheckRecoverCodeDto
  ): Promise<ReturnObj> {
    let { resultCode } = await this.userService.checkUserVerifyCodeById(
      req.user.userid,
      param.recover_code
    );
    return getReturnObj(resultCode);
  }

  @Put("payment")
  @ApiOperation({
    title: "更換信用卡",
    description: "更換綁定信用卡"
  })
  async updateUserPaymentById(
    @Req() req: Request,
    @Body() param: UpdateUserPaymentDto
  ): Promise<ReturnObj> {
    let { resultCode } = await this.userService.updateUserPaymentById(
      req.user.userid,
      param.prime
    );
    return getReturnObj(resultCode);
  }

  @Put("invoice/donate")
  @ApiOperation({
    title: "修改電子發票(捐贈)",
    description: "修改電子發票處理方式為捐贈"
  })
  async updateUserInvoiceTypeToDonate(@Req() req: Request): Promise<ReturnObj> {
    let userToUpdate = new User();
    userToUpdate.invoice_type = 0;
    let result = await this.userService.updateInvoiceTypeById(
      req.user.userid,
      userToUpdate
    );
    if (!result) {
      throw new HttpException(
        {
          message: "Input data validation failed"
        },
        HttpStatus.BAD_REQUEST
      );
    }
    return getReturnObj(ResultCode.SUCCESS);
  }

  @Put("invoice/email")
  @ApiOperation({
    title: "修改電子發票(email))",
    description: "修改電子發票處理方式為寄送至使用者email"
  })
  async updateUserInvoiceTypeToEmail(
    @Req() req: Request,
    @Body() param: UpdateUserInvoiceEmailDto
  ): Promise<ReturnObj> {
    let userToUpdate = new User();
    userToUpdate.email = param.email;
    userToUpdate.invoice_type = 2;
    let result = await this.userService.updateInvoiceTypeById(
      req.user.userid,
      userToUpdate
    );
    if (!result) {
      throw new HttpException(
        {
          message: "Input data validation failed"
        },
        HttpStatus.BAD_REQUEST
      );
    }
    return getReturnObj(ResultCode.SUCCESS);
  }

  @Put("invoice/device")
  @ApiOperation({
    title: "修改電子發票(手機載具)",
    description: "修改電子發票處理方式為儲存於手機載具編號"
  })
  async updateUserInvoiceTypeToDevice(
    @Req() req: Request,
    @Body() param: UpdateUserInvoiceDeviceDto
  ): Promise<ReturnObj> {
    let userToUpdate = new User();
    userToUpdate.mobile_device = param.mobile_device;
    userToUpdate.invoice_type = 1;
    let result = await this.userService.updateInvoiceTypeById(
      req.user.userid,
      userToUpdate
    );
    if (!result) {
      throw new HttpException(
        {
          message: "Input data validation failed"
        },
        HttpStatus.BAD_REQUEST
      );
    }
    return getReturnObj(ResultCode.SUCCESS);
  }
}
