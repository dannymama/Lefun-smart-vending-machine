import {
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  MinLength,
  Length,
  Matches,
  IsEmail,
  IsDateString
} from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";

export class UpdateUserInvoiceEmailDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}

export class UpdateUserInvoiceDeviceDto {
  @IsNotEmpty()
  @Matches(/^\/{1}[0-9A-Z]{7}$/)
  readonly mobile_device: string;
}

export class UpdateUserNameDto {
  @IsNotEmpty()
  @MaxLength(10)
  @MinLength(1)
  readonly user_name: string;
}

export class UpdateVerifyCodeDto {
  @IsNotEmpty()
  @IsNumberString()
  @Length(6)
  @Matches(/^\d{6}$/)
  @ApiModelProperty()
  readonly verify_code: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(8)
  @Matches(/^\d{8}$/)
  @ApiModelProperty()
  readonly recover_code: string;
}

export class UpdateUserPaymentDto {
  @IsNotEmpty()
  readonly prime: string;
}

export class FindUserDto {
  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(5)
  @MinLength(20)
  readonly account: string;
}

export class FindUserByPhoneNumDto {
  @IsNotEmpty()
  @IsNumberString()
  readonly phone_number: string;
}

export class findBehaviorLogByPhoneNumDto {
  @IsNotEmpty()
  @IsNumberString()
  readonly phone_number: string;

  @IsNotEmpty()
  @IsNumberString()
  readonly limit: number;

  @IsNotEmpty()
  @IsNumberString()
  readonly offset: number;

  @IsNotEmpty()
  @IsDateString()
  readonly start_time: string;

  @IsNotEmpty()
  @IsDateString()
  readonly end_time: string;
}

export class findTransactionLogByPhoneNumDto {
  @IsNotEmpty()
  @IsNumberString()
  readonly phone_number: string;

  @IsNotEmpty()
  @IsNumberString()
  readonly limit: number;

  @IsNotEmpty()
  @IsNumberString()
  readonly offset: number;

  @IsNotEmpty()
  @IsDateString()
  readonly start_time: string;

  @IsNotEmpty()
  @IsDateString()
  readonly end_time: string;
}
export class getRegisterSumInPeriodDto {
  @IsNotEmpty()
  @IsDateString()
  readonly start_time: string;

  @IsNotEmpty()
  @IsDateString()
  readonly end_time: string;
}
export class CreateUserByFacebookDto {
  @IsNotEmpty()
  @MaxLength(10)
  @MinLength(1)
  readonly user_name: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(6)
  @Matches(/^\d{6}$/)
  readonly verify_code: string;

  @IsNotEmpty()
  readonly fb_accesstoken: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly realname: string;

  @IsNotEmpty()
  readonly prime: string;
}

export class CreateUserByGoogleDto {
  @IsNotEmpty()
  @MaxLength(10)
  @MinLength(1)
  readonly user_name: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(6)
  @Matches(/^\d{6}$/)
  readonly verify_code: string;

  @IsNotEmpty()
  readonly google_accesstoken: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly realname: string;

  @IsNotEmpty()
  readonly prime: string;
}

export class CreateUserBySMSDto {
  @IsNotEmpty()
  @MaxLength(10)
  @MinLength(1)
  @ApiModelProperty()
  readonly user_name: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(6)
  @Matches(/^\d{6}$/)
  @ApiModelProperty()
  readonly verify_code: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(8)
  @Matches(/^\d{8}$/)
  @ApiModelProperty()
  readonly recover_code: string;

  @IsNotEmpty()
  @ApiModelProperty()
  readonly sms_token: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiModelProperty()
  readonly email: string;

  @IsNotEmpty()
  @ApiModelProperty()
  readonly realname: string;

  @IsNotEmpty()
  @ApiModelProperty()
  readonly prime: string;
}
