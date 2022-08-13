import { IsEmail } from "class-validator";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Unique
} from "typeorm";
import { User } from "../models";

@Entity("tappay_payment")
export class PaymentInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ default: true })
  public is_valid: boolean;

  //刷卡用真實姓名
  @Column({ length: 10 })
  public realname: string;

  //刷卡用電子信箱
  @Column("varchar")
  @IsEmail()
  public email: string;

  //信用卡token
  @Column({ length: 64 })
  public taypay_token: string;

  //信用卡secret
  @Column({ length: 64 })
  public taypay_secret: string;

  //前六碼
  @Column({ length: 6 })
  public taypay_bin_code: string;

  //後四碼
  @Column({ length: 4 })
  public taypay_last_four: string;

  //發卡銀行
  @Column("varchar")
  public taypay_issuer: string;

  /* 
    卡片類別
        0 = 信用卡 (Credit Card)
        1 = 簽帳卡 (Debit Card)
        2 = 預付卡 (Prepaid Card)
    */
  @Column()
  public taypay_funding: number;

  /* 
    卡片種類
        1 = VISA
        2 = MasterCard
        3 = JCB
        4 = Union Pay
        5 = AMEX
    */
  @Column()
  public taypay_type: number;

  //卡片等級
  @Column("varchar")
  public taypay_level: string;

  //發卡行國家
  @Column("varchar")
  public taypay_country: string;

  //發卡行國家碼
  @Column("varchar")
  public taypay_country_code: string;

  //卡片到期時間，格式 YYYYMM，( remember = true 時回傳)
  @Column("varchar")
  public taypay_expiry_date: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(type => User, user => user.paymentInfo)
  @JoinColumn({ referencedColumnName: "lefun_user_id", name: "lefun_user_id" })
  public user: User;
}
