import { EntityRepository, Repository } from "typeorm";
import { PerchaseLog, LefunTransaction } from "../models";

@EntityRepository(PerchaseLog)
export class PerchaseLogRepository extends Repository<PerchaseLog> {
  public findOneByLefunTransaction(
    lefunTransaction: LefunTransaction
  ): Promise<PerchaseLog> {
    return this.manager.findOne(PerchaseLog, {
      where: { lefunTransaction: lefunTransaction }
    });
  }
}
