import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Index
} from "typeorm";
import { User, LefunTransaction } from "../models";

@Entity("tappay_transaction_log")
export class TransactionLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  //交易明細
  @Column("varchar")
  public memo: string;

  //taypay交易單號
  @Index()
  @Column({ length: 32 })
  public rec_trade_id: string;

  //銀行交易單號
  @Column({ length: 32 })
  public bank_transaction_id: string;

  //銀行授權碼
  @Column({ length: 16 })
  public auth_code: string;

  //交易金額
  @Column()
  public amount: number;

  //貨幣種類
  @Column({ length: 16 })
  public currency: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(type => User, user => user.transactionlog)
  @JoinColumn({ referencedColumnName: "lefun_user_id", name: "lefun_user_id" })
  public user: User;

  @OneToOne(type => LefunTransaction)
  @JoinColumn({
    referencedColumnName: "lefun_transaction_id",
    name: "lefun_transaction_id"
  })
  lefunTransaction: LefunTransaction;
}
