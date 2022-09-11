import { EntityRepository, Repository } from "typeorm";
import { LoginInfo } from "../models";

@EntityRepository(LoginInfo)
export class LoginInfoRepository extends Repository<LoginInfo> {
  public findOneByToken(login_token: string): Promise<LoginInfo> {
    return this.manager.findOne(LoginInfo, { where: { login_token } });
  }

  public async removeByToken(login_token: string): Promise<any> {
    return this.manager
      .createQueryBuilder()
      .delete()
      .from(LoginInfo)
      .where("login_token = :login_token", { login_token: login_token })
      .execute();
  }

  public async removeByUserID(userid: string): Promise<any> {
    return this.manager
      .createQueryBuilder()
      .delete()
      .from(LoginInfo)
      .where("lefun_user_id = :lefun_user_id", { lefun_user_id: userid })
      .execute();
  }

  public async removeByDeviceID(login_deviceID: string): Promise<any> {
    return this.manager
      .createQueryBuilder()
      .delete()
      .from(LoginInfo)
      .where("login_deviceID = :login_deviceID", {
        login_deviceID: login_deviceID
      })
      .execute();
  }
}
