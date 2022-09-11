import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("lefun_backend_user")
export class BackendUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Index()
  @Column({ length: 100, default: "" })
  public account: string;

  @Column({ length: 100, default: "" })
  public password: string;

  // 0:normal, 1:admin
  @Column({ default: 0 })
  public type: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
