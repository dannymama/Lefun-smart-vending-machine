import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from "typeorm";
@Entity("lefun_productlist")
export class ProductList extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  //商品名稱
  @Column({ default: "" })
  public title: string;

  //商品資訊
  @Column({ default: "" })
  public memo: string;

  //RFID Tag id
  @Index()
  @Column({ default: "" })
  public tag_id: string;

  //商品單價
  @Column()
  public price: number;

  //內文
  @Column({ default: false })
  public isUsed: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
