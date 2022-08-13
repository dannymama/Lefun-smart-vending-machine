import { IsNotEmpty, IsNumberString, IsDateString } from "class-validator";

export class findDto {
  @IsNotEmpty()
  @IsDateString()
  readonly start_time: string;

  @IsNotEmpty()
  @IsDateString()
  readonly end_time: string;
}

export class getPerchaseDto {
  @IsNotEmpty()
  @IsNumberString()
  readonly limit: number;

  @IsNotEmpty()
  @IsNumberString()
  readonly offset: number;
}

export class createPerchaseDto {
  @IsNotEmpty()
  readonly device_id: string;

  @IsNotEmpty()
  readonly device_name: string;

  @IsNotEmpty()
  readonly product_list: string;

  @IsNotEmpty()
  readonly lefun_transaction_id: string;

  @IsNotEmpty()
  readonly verify_token: string;

  @IsNotEmpty()
  readonly checksum: string;
}
