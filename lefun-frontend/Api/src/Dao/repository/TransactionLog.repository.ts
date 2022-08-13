import { EntityRepository, Repository } from "typeorm";
import { TransactionLog } from "../models";

@EntityRepository(TransactionLog)
export class TransactionLogRepository extends Repository<TransactionLog> {}
