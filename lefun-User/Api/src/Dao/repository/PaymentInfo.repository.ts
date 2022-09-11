import { EntityRepository, Repository } from "typeorm";
import { PaymentInfo } from "../models";

@EntityRepository(PaymentInfo)
export class PaymentInfoRepository extends Repository<PaymentInfo> {
  public async updateById(id: number, updateObj: PaymentInfo): Promise<any> {
    return this.manager
      .createQueryBuilder()
      .update(PaymentInfo)
      .set(updateObj)
      .where({
        id: id
      })
      .execute();
  }

  public async setInvalid(id: number): Promise<any> {
    return this.manager
      .createQueryBuilder()
      .update(PaymentInfo)
      .set({ is_valid: false })
      .where("id = :id", { id: id })
      .execute();
  }
}
