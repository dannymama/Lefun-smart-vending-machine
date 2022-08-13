import { EntityRepository, Repository, Raw } from "typeorm";
import { LefunTransaction, User } from "../models";

@EntityRepository(LefunTransaction)
export class LefunTransactionRepository extends Repository<LefunTransaction> {
  public async createTransaction(user: User): Promise<any> {
    let insertRes = await this.manager
      .createQueryBuilder()
      .insert()
      .into(LefunTransaction)
      .values({
        lefun_transaction_id: this.generateTransactionID(),
        memo: "",
        user: user,
        use_lefun_point: false,
        invoice_type: user.invoice_type,
        verify_token: () => "REPLACE(UUID(),'-','')",
        exipry_time: () => "NOW()+ INTERVAL 5 MINUTE"
      })
      .execute();
    return await this.manager.findOne(LefunTransaction, {
      where: { id: insertRes.identifiers[0].id }
    });
  }

  private generateTransactionID(): string {
    let time = new Date();
    let y = time.getFullYear().toString();
    let m = (time.getMonth() + 1).toString();
    let d = time.getDate().toString();
    let h = time.getHours().toString();
    let mm = time.getMinutes().toString();
    let s = time.getSeconds().toString();
    let randomstring = this.randomString(11);
    let res =
      "Lefun" +
      y +
      this.add0(m) +
      this.add0(d) +
      this.add0(h) +
      this.add0(mm) +
      this.add0(s) +
      randomstring;
    return res;
  }

  private add0(i: any): string {
    return i < 10 ? "0" + i : i;
  }

  private randomString(len: number): string {
    len = len || 32;
    let $chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let maxPos = $chars.length;
    let pwd = "";
    for (let i = 0; i < len; i++) {
      //0~32的整数
      pwd += $chars.charAt(Math.floor(Math.random() * (maxPos + 1)));
    }
    return pwd;
  }

  public async setVerifiedAndUpdate(
    lefun_transaction_id: string,
    use_lefun_point: boolean,
    device_id: string,
    device_name: string
  ): Promise<any> {
    return this.manager
      .createQueryBuilder()
      .update(LefunTransaction)
      .set({
        is_verified: true,
        use_lefun_point: use_lefun_point,
        device_id: device_id,
        device_name: device_name
      })
      .where("lefun_transaction_id = :lefun_transaction_id", {
        lefun_transaction_id: lefun_transaction_id
      })
      .execute();
  }

  public async setFinished(lefun_transaction_id: string): Promise<any> {
    return this.manager
      .createQueryBuilder()
      .update(LefunTransaction)
      .set({ is_finished: true })
      .where("lefun_transaction_id = :lefun_transaction_id", {
        lefun_transaction_id: lefun_transaction_id
      })
      .execute();
  }

  public findOneByID(lefun_transaction_id: string): Promise<LefunTransaction> {
    return this.manager.findOne(LefunTransaction, {
      where: {
        lefun_transaction_id: lefun_transaction_id,
        expiryTime: Raw(alias => `${alias} > NOW()`)
      },
      relations: ["user"]
    });
  }

  public findOneVerified(
    lefun_transaction_id: string
  ): Promise<LefunTransaction> {
    return this.manager.findOne(LefunTransaction, {
      where: {
        lefun_transaction_id: lefun_transaction_id,
        is_verified: true,
        is_finished: false
      },
      relations: ["user"]
    });
  }
}
