import { IsNotEmpty, Length, Matches } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";
export class createLefunTransactionDto {
  @IsNotEmpty()
  @Length(6)
  @Matches(/^\d{6}$/)
  @ApiModelProperty({
    description: "交易密碼",
    required: true
  })
  readonly verifyCode: string;
}

export class getLefunTransactionDto {
  @IsNotEmpty()
  @ApiModelProperty({
    description: "樂坊交易訂單號",
    required: true
  })
  readonly lefun_transaction_id: string;
}

export class verifyLefunTransactionDto {
  @IsNotEmpty()
  @ApiModelProperty({
    description: "樂坊交易訂單號",
    required: true
  })
  readonly lefun_transaction_id: string;

  @IsNotEmpty()
  @ApiModelProperty({
    description: "裝置編號",
    required: true
  })
  readonly device_id: string;

  @IsNotEmpty()
  @ApiModelProperty({
    description: "裝置名稱",
    required: true
  })
  readonly device_name: string;

  @IsNotEmpty()
  @ApiModelProperty({
    description: "是否使用樂坊點數",
    required: true
  })
  readonly usePoint: string;

  @IsNotEmpty()
  @ApiModelProperty({
    description: "檢查碼",
    required: true
  })
  readonly checksum: string;
}
