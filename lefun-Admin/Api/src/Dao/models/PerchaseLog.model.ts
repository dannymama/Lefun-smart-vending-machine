import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne
} from "typeorm";
import { User, LefunTransaction, TransactionLog } from "../models";

@Entity("lefun_perchaselog")
export class PerchaseLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  //裝置id, mac address
  @Column({ length: 128, default: "" })
  public device_id: string;

  //自定義裝置名稱
  @Column({ length: 32, default: "" })
  public device_name: string;

  //總金額
  @Column()
  public amount: number;

  //子項目資訊
  @Column("text")
  public product_list: string;

  //子項目資訊
  @Column("text")
  public invoice_url: string;

  @Column({ default: false })
  public use_lefun_point: boolean;

  //使用者電子發票類型 0:捐贈, 1:載具 2:email
  @Column({ default: 0 })
  public invoice_type: number;

  @Column({ default: false })
  public isPaid: boolean;

  @Column({ default: false })
  public is_issue_invoice: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(type => User, user => user.perchaselog)
  @JoinColumn({ referencedColumnName: "lefun_user_id", name: "lefun_user_id" })
  public user: User;

  @OneToOne(type => LefunTransaction)
  @JoinColumn({
    referencedColumnName: "lefun_transaction_id",
    name: "lefun_transaction_id"
  })
  public lefunTransaction: LefunTransaction;

  @OneToOne(type => TransactionLog)
  @JoinColumn({
    referencedColumnName: "rec_trade_id",
    name: "rec_trade_id"
  })
  public transactionLog: TransactionLog;
}
