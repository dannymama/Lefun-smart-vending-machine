import { IsNotEmpty, IsNumberString } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";

export class createSMSTokenDto {
  @IsNotEmpty()
  @IsNumberString()
  @ApiModelProperty({
    description: "手機號碼",
    required: true
  })
  readonly phone_number: string;
}

export class verifyCodeDto {
  @IsNotEmpty()
  @ApiModelProperty({
    description: "呼叫簡訊寄送api時回傳之授權碼",
    required: true
  })
  readonly sms_token: string;

  @IsNotEmpty()
  @IsNumberString()
  @ApiModelProperty({
    description: "簡訊驗證碼",
    required: true
  })
  readonly verify_code: string;
}
