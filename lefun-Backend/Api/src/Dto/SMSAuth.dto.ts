import { IsNotEmpty, IsNumberString } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";

export class createSMSTokenDto {
  @IsNotEmpty()
  @IsNumberString()
  @ApiModelProperty()
  readonly phone_number: string;
}

export class verifyCodeDto {
  @IsNotEmpty()
  @ApiModelProperty()
  readonly sms_token: string;

  @IsNotEmpty()
  @IsNumberString()
  @ApiModelProperty()
  readonly verify_code: string;
}
