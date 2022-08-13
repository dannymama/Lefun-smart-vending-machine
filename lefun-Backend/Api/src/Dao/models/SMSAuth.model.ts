import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from "typeorm";

@Entity("lefun_smsauth")
export class SMSAuth extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  //sms發送token
  @Index({ unique: true })
  @Column({ length: 32 })
  public sms_token: string;

  //電話號碼
  @Column({ length: 10 })
  public phone_number: string;

  //驗證號碼
  @Column({ length: 6 })
  public verify_code: string;

  //是否已驗證成功
  @Column({ default: false })
  public is_verified: boolean;

  //是否已使用
  @Column({ default: false })
  public is_used: boolean;

  //token過期時間
  @Column({ type: "timestamp" })
  public expiry_time: Date;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
