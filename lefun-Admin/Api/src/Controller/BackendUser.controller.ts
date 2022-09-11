import {
  Get,
  Controller,
  Param,
  Post,
  Body,
  Put,
  Delete
} from "@nestjs/common";
import { BackendUserService } from "../Service/BackendUser.service";
import {
  createDto,
  deleteDto,
  loginDto,
  findAllDto,
  updateDto
} from "../Dto/BackendUser.dto";
import { getReturnObj, ResultCode, ReturnObj } from "../Shared/enums";
import * as bcrypt from "bcrypt-nodejs";

@Controller("backend_user")
export class BackendUserController {
  constructor(private readonly backendUserService: BackendUserService) {}

  // @Get("me")
  // async findMe(@Param() param: findContentDto): Promise<ReturnObj> {
  //   // let result = await this.newsService.findOneByID(param.id);
  //   return getReturnObj(ResultCode.SUCCESS, result);
  // }

  @Get(":limit/:offset")
  async findAll(@Param() param: findAllDto): Promise<ReturnObj> {
    let [backend_users, counts] = await this.backendUserService.find(
      param.limit,
      param.offset
    );
    return getReturnObj(ResultCode.SUCCESS, {
      users: backend_users,
      count: counts
    });
  }

  @Post()
  async createBackendUser(@Body() param: createDto): Promise<ReturnObj> {
    let user = await this.backendUserService.findOneByAccount(param.account);
    if (user) {
      return getReturnObj(ResultCode.ACCOUNT_ALREADY_EXIST);
    }

    await this.backendUserService.create(
      param.account,
      param.password,
      param.type
    );

    return getReturnObj(ResultCode.SUCCESS);
  }

  @Delete()
  async deleteBackendUser(@Body() param: deleteDto): Promise<ReturnObj> {
    await this.backendUserService.remove(param.id);
    return getReturnObj(ResultCode.SUCCESS);
  }

  @Put()
  async updateBackendUser(@Body() param: updateDto): Promise<ReturnObj> {
    await this.backendUserService.updateById(
      param.id,
      param.password,
      param.type
    );
    return getReturnObj(ResultCode.SUCCESS);
  }

  @Post("login")
  async createBySMSToken(@Body() param: loginDto): Promise<ReturnObj> {
    let user = await this.backendUserService.findOneByAccount(param.account);
    if (!user) {
      return getReturnObj(ResultCode.ACCOUNT_NOT_EXIST);
    }

    if (!bcrypt.compareSync(param.password, user.password)) {
      return getReturnObj(ResultCode.WRONG_PASSWORD);
    }

    let data = {};
    //驗證通過產生簽章
    let login_token = await this.backendUserService.signToken({
      userid: user.id,
      type: user.type
    });
    //回傳簽章
    data = { login_token: login_token };
    return getReturnObj(ResultCode.SUCCESS, data);
  }
}
