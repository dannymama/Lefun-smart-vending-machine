import { EntityRepository, Repository } from "typeorm";
import { BackendUser } from "../models";

@EntityRepository(BackendUser)
export class BackendUserRepository extends Repository<BackendUser> {
  public findOneByAccount(account: string): Promise<BackendUser> {
    return this.manager.findOne(BackendUser, { where: { account } });
  }

  public async removeById(id: number): Promise<BackendUser> {
    const itemToRemove: BackendUser = await this.findOne({ id });
    return this.manager.remove(itemToRemove);
  }

  public async updateById(id: number, updateObj: BackendUser): Promise<any> {
    return this.manager
      .createQueryBuilder()
      .update(BackendUser)
      .set(updateObj)
      .where("id = :id", { id: id })
      .execute();
  }
}
