import { EntityRepository, Repository } from "typeorm";
import { User } from "../models";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public findOneByOpenID(openid_account: string): Promise<User> {
    return this.manager.findOne(User, {
      where: { openid_account: openid_account }
    });
  }

  public findOneByPhoneNum(
    phone_number: string,
    relations?: any[]
  ): Promise<User> {
    return this.manager.findOne(User, {
      where: { phone_number: phone_number },
      relations: relations
    });
  }

  //透過UID查找
  public findOneByUID(uid: string, relations?: any[]): Promise<User> {
    return this.manager.findOne(User, {
      where: { id: uid },
      relations: relations
    });
  }

  //透過lefun_user_id查找
  public findOneById(id: string, relations?: any[]): Promise<User> {
    return this.manager.findOne(User, {
      where: { lefun_user_id: id },
      relations: relations
    });
  }

  public async updateById(userid: string, updateObj: object): Promise<any> {
    return this.manager
      .createQueryBuilder()
      .update(User)
      .set(updateObj)
      .where("lefun_user_id = :lefun_user_id", { lefun_user_id: userid })
      .execute();
  }
}
