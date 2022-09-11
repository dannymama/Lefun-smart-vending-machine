import { EntityRepository, Repository } from "typeorm";
import { SMSAuth } from "../models";

@EntityRepository(SMSAuth)
export class SMSAuthRepository extends Repository<SMSAuth> {
  public async createToken(
    phone_number: string,
    verify_code: string
  ): Promise<any> {
    let insertRes = await this.manager
      .createQueryBuilder()
      .insert()
      .into(SMSAuth)
      .values({
        sms_token: () => "REPLACE( UUID(), '-',  '' )",
        phone_number: phone_number,
        verify_code: verify_code,
        expiry_time: () => "NOW() + INTERVAL 5 MINUTE"
      })
      .execute();
    return await this.manager.findOne(SMSAuth, {
      where: { id: insertRes.identifiers[0].id }
    });
  }

  //效期內token
  public findOneToVerify(sms_token: string): Promise<SMSAuth> {
    return this.manager
      .createQueryBuilder(SMSAuth, "SMSAuth")
      .where("sms_token = :sms_token", { sms_token: sms_token })
      .andWhere("expiry_time >= NOW()")
      .getOne();
  }

  //驗證過待使用token
  public findOneToUse(sms_token: string): Promise<SMSAuth> {
    return this.manager.findOne(SMSAuth, {
      where: { sms_token: sms_token, is_verified: true, is_used: false }
    });
  }

  //驗證
  public async setVerified(sms_token: string): Promise<any> {
    return this.manager
      .createQueryBuilder()
      .update(SMSAuth)
      .set({ is_verified: true })
      .where("sms_token = :sms_token", { sms_token: sms_token })
      .execute();
  }
  //使用
  public async setUsed(sms_token: string): Promise<any> {
    return this.manager
      .createQueryBuilder()
      .update(SMSAuth)
      .set({ is_used: true })
      .where("sms_token = :sms_token", { sms_token: sms_token })
      .execute();
  }
}
