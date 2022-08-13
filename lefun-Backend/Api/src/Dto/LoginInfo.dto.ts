import { IsNotEmpty } from "class-validator";

/*
sms_token: 寄送簡訊api回傳之簡訊token 
*/

export class createLoginInfoBySMSDto {
  @IsNotEmpty()
  readonly sms_token: string;
}
