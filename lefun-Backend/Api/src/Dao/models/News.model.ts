import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
@Entity("lefun_news")
export class News extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  //標題
  @Column({ length: 100 })
  public title: string;

  //副標題
  @Column({ length: 100 })
  public sub_title: string;

  //圖片URL
  @Column("varchar")
  public imageURL: string;

  //內文
  @Column("text")
  public context: string;

  //內文
  @Column()
  public isHot: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
