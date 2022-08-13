import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  OneToOne
} from "typeorm";
import { User, TransactionLog } from "../models";

@Entity("lefun_transaction")
export class LefunTransaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  //訂單編號,配合綠界自訂編號格式長度為30字元
  @Index({ unique: true })
  @Column({ length: 30 })
  public lefun_transaction_id: string;

  //開門驗證字串，接收取物結果時確保來源為開門者
  @Column({ length: 32, default: "" })
  public verify_token: string;

  //裝置id, mac address
  @Column({ length: 128, default: "" })
  public device_id: string;

  //自定義裝置名稱
  @Column({ length: 32, default: "" })
  public device_name: string;

  //使用者電子發票類型 0:捐贈, 1:載具 2:email
  @Column({ default: 0 })
  public invoice_type: number;

  //是否使用樂坊點數折扣
  @Column({ default: false })
  public use_lefun_point: boolean;

  //是否已完成驗證開門
  @Column({ default: false })
  public is_verified: boolean;

  //是否完成交易
  @Column({ default: false })
  public is_finished: boolean;

  @Column("text")
  public memo: string;

  @Column({ type: "timestamp" })
  public exipry_time: Date;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(type => User, user => user.lefunTrans)
  @JoinColumn({ referencedColumnName: "lefun_user_id", name: "lefun_user_id" })
  public user: User;
}
