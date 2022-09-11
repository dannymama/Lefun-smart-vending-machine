import { IsNotEmpty } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";

/*
sms_token: 寄送簡訊api回傳之簡訊token 
*/

export class createLoginInfoBySMSDto {
  @IsNotEmpty()
  @ApiModelProperty({
    description: "呼叫簡訊寄送api時回傳之授權碼",
    required: true
  })
  readonly sms_token: string;
}
