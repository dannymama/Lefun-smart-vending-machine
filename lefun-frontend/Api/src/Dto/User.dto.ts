import {
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  MinLength,
  Length,
  Matches,
  IsEmail
} from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";

export class UpdateUserInvoiceEmailDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiModelProperty({
    description: "電子信箱",
    required: true
  })
  readonly email: string;
}

export class UpdateUserInvoiceDeviceDto {
  @IsNotEmpty()
  @Matches(/^\/{1}[0-9A-Z]{7}$/)
  @ApiModelProperty({
    description: "手機載具編號",
    pattern: "/^/{1}[0-9A-Z]{7}$/",
    required: true
  })
  readonly mobile_device: string;
}

export class UpdateUserNameDto {
  @IsNotEmpty()
  @MaxLength(10)
  @MinLength(1)
  @ApiModelProperty({
    description: "使用者名稱",
    required: true
  })
  readonly user_name: string;
}

export class UpdateVerifyCodeDto {
  @IsNotEmpty()
  @IsNumberString()
  @Length(6)
  @Matches(/^\d{6}$/)
  @ApiModelProperty({
    description: "交易密碼",
    required: true
  })
  readonly verify_code: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(8)
  @Matches(/^\d{8}$/)
  @ApiModelProperty({
    description: "還原密碼",
    required: true
  })
  readonly recover_code: string;
}

export class CheckRecoverCodeDto {
  @IsNotEmpty()
  @IsNumberString()
  @Length(8)
  @Matches(/^\d{8}$/)
  @ApiModelProperty({
    description: "還原密碼",
    required: true
  })
  readonly recover_code: string;
}

export class UpdateUserPaymentDto {
  @IsNotEmpty()
  @ApiModelProperty({
    description: "Tappay Prime",
    required: true
  })
  readonly prime: string;
}

// export class FindUserDto {
//   @IsNotEmpty()
//   @IsNumberString()
//   @MaxLength(5)
//   @MinLength(20)
//   readonly account: string;
// }

// export class CreateUserByFacebookDto {
//   @IsNotEmpty()
//   @MaxLength(10)
//   @MinLength(1)
//   readonly user_name: string;

//   @IsNotEmpty()
//   @IsNumberString()
//   @Length(6)
//   @Matches(/^\d{6}$/)
//   readonly verify_code: string;

//   @IsNotEmpty()
//   readonly fb_accesstoken: string;

//   @IsNotEmpty()
//   @IsEmail()
//   readonly email: string;

//   @IsNotEmpty()
//   readonly realname: string;

//   @IsNotEmpty()
//   readonly prime: string;
// }

// export class CreateUserByGoogleDto {
//   @IsNotEmpty()
//   @MaxLength(10)
//   @MinLength(1)
//   readonly user_name: string;

//   @IsNotEmpty()
//   @IsNumberString()
//   @Length(6)
//   @Matches(/^\d{6}$/)
//   readonly verify_code: string;

//   @IsNotEmpty()
//   readonly google_accesstoken: string;

//   @IsNotEmpty()
//   @IsEmail()
//   readonly email: string;

//   @IsNotEmpty()
//   readonly realname: string;

//   @IsNotEmpty()
//   readonly prime: string;
// }

export class CreateUserBySMSDto {
  @IsNotEmpty()
  @MaxLength(10)
  @MinLength(1)
  @ApiModelProperty({
    description: "使用者名稱",
    required: true
  })
  readonly user_name: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(6)
  @Matches(/^\d{6}$/)
  @ApiModelProperty({
    description: "交易密碼",
    required: true
  })
  readonly verify_code: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(8)
  @Matches(/^\d{8}$/)
  @ApiModelProperty({
    description: "還原密碼",
    required: true
  })
  readonly recover_code: string;

  @IsNotEmpty()
  @ApiModelProperty({
    description: "呼叫簡訊寄送api時回傳之授權碼",
    required: true
  })
  readonly sms_token: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiModelProperty({
    description: "電子信箱",
    required: true
  })
  readonly email: string;

  @IsNotEmpty()
  @ApiModelProperty({
    description: "真實姓名",
    required: true
  })
  readonly realname: string;

  @IsNotEmpty()
  @ApiModelProperty({
    description: "Tappay Prime",
    required: true
  })
  readonly prime: string;
}
