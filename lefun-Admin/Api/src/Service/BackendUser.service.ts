import { Injectable } from "@nestjs/common";
import { getCustomRepository } from "typeorm";
import { BackendUser } from "../Dao/models";
import { BackendUserRepository } from "../Dao/repository";
import * as bcrypt from "bcrypt-nodejs";
import * as JWT from "jsonwebtoken";
import { config } from "../Config/config";

@Injectable()
export class BackendUserService {
  constructor() {}

  async findOneByAccount(account: string): Promise<BackendUser> {
    return getCustomRepository(BackendUserRepository).findOneByAccount(account);
  }

  async find(limit: number, offset: number): Promise<[BackendUser[], number]> {
    return getCustomRepository(BackendUserRepository).findAndCount({
      select: ["id", "account", "type", "createdAt"],
      order: {
        id: "DESC"
      },
      skip: offset,
      take: limit
    });
  }

  async create(account: string, password: string, type: number): Promise<any> {
    let backendUser = new BackendUser();
    backendUser.account = account;
    backendUser.password = bcrypt.hashSync(password);
    backendUser.type = type;
    return getCustomRepository(BackendUserRepository).save(backendUser);
  }

  async updateById(id: number, password: string, type: number): Promise<any> {
    let backendUser = new BackendUser();
    backendUser.password = bcrypt.hashSync(password);
    backendUser.type = type;
    return getCustomRepository(BackendUserRepository).updateById(
      id,
      backendUser
    );
  }

  async remove(id: number): Promise<any> {
    return getCustomRepository(BackendUserRepository).removeById(id);
  }

  public signToken(
    params: { userid: number; type: number },
    options?: any
  ): string {
    return JWT.sign(params, config.SECRET, options || undefined);
  }
}
