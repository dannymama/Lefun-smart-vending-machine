import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index
} from "typeorm";
import {
  PaymentInfo,
  TransactionLog,
  BehaviorLog,
  PerchaseLog,
  LoginInfo,
  LefunTransaction
} from "../models";

@Entity("lefun_user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  //使用者openid
  @Index()
  @Column({ length: 100, default: "" })
  public openid_account: string;

  //使用者email
  @Column({ length: 100, default: "" })
  public email: string;

  //使用者手機載具編號
  @Column({ length: 100, default: "" })
  public mobile_device: string;

  //使用者電子發票類型 0:捐贈, 1:載具 2:email
  @Column({ default: 0 })
  public invoice_type: number;

  //樂坊ＩＤ（註冊時系統自動產生）用於對應各資料表及萊檬api帳號
  @Index({ unique: true })
  @Column({ length: 32 })
  public lefun_user_id: string;

  //樂坊點數
  @Column({ default: 0 })
  public lefun_point: number;

  //使用者註冊手機號碼
  @Column({ length: 10, default: "" })
  public phone_number: string;

  //使用者暱稱
  @Column({ length: 20 })
  public user_name: string;

  //安全密碼 開門取物前輸入驗證
  @Column({ length: 6 })
  public verify_code: string;

  //安全密碼修改碼
  @Column({ length: 8 })
  public recover_code: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @OneToMany(type => PaymentInfo, payment => payment.user, { cascade: true })
  public paymentInfo: PaymentInfo[];

  @OneToMany(type => TransactionLog, log => log.user, { cascade: true })
  public transactionlog: TransactionLog[];

  @OneToMany(type => BehaviorLog, log => log.user, { cascade: true })
  public behaviorlog: BehaviorLog[];

  @OneToMany(type => PerchaseLog, log => log.user, { cascade: true })
  public perchaselog: PerchaseLog[];

  @OneToMany(type => LoginInfo, login => login.user, { cascade: true })
  public loginInfo: LoginInfo[];

  @OneToMany(type => LefunTransaction, tran => tran.user, { cascade: true })
  public lefunTrans: LefunTransaction[];
}
