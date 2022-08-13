import { IsNotEmpty, Length, Matches } from "class-validator";

export class createLefunTransactionDto {
  @IsNotEmpty()
  @Length(6)
  @Matches(/^\d{6}$/)
  readonly verifyCode: string;
}

export class getLefunTransactionDto {
  @IsNotEmpty()
  readonly lefun_transaction_id: string;
}

export class verifyLefunTransactionDto {
  @IsNotEmpty()
  readonly lefun_transaction_id: string;

  @IsNotEmpty()
  readonly device_id: string;

  @IsNotEmpty()
  readonly device_name: string;

  @IsNotEmpty()
  readonly usePoint: string;

  @IsNotEmpty()
  readonly checksum: string;
}
