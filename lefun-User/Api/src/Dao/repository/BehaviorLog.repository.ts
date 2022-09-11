import { EntityRepository, Repository } from "typeorm";
import { BehaviorLog, User } from "../models";

@EntityRepository(BehaviorLog)
export class BehaviorLogRepository extends Repository<BehaviorLog> {
  public createOne(user: User, memo: string, type: string): Promise<any> {
    let behaviorLog = new BehaviorLog();
    behaviorLog.user = user;
    behaviorLog.memo = memo;
    behaviorLog.type = type;
    return this.manager.save(behaviorLog);
  }

  public findOneById(id: number): Promise<BehaviorLog> {
    return this.manager.findOne(BehaviorLog, { where: { id } });
  }
}
