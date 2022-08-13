import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { User } from "../models";

@Entity("lefun_logininfo")
export class LoginInfo extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public login_token: string;

  //登入用戶
  @ManyToOne(type => User, user => user.paymentInfo)
  @JoinColumn({ referencedColumnName: "lefun_user_id", name: "lefun_user_id" })
  public user: User;

  //登入裝置來源
  // @Column("varchar")
  // public login_deviceID: string;

  //登入裝置資訊
  @Column("varchar")
  public login_device_info: string;

  //登入ip
  @Column("varchar")
  public login_ip: string;

  @Column({ default: true })
  public is_valid: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
