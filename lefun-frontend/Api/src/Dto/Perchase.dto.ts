import { IsNotEmpty, IsNumberString } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";

export class findDto {
  @IsNotEmpty()
  @ApiModelProperty({
    description: "樂坊訂單號",
    required: true
  })
  readonly id: string;
}

export class getPerchaseDto {
  @IsNotEmpty()
  @IsNumberString()
  @ApiModelProperty({
    description: "上限值",
    required: true
  })
  readonly limit: number;

  @IsNotEmpty()
  @IsNumberString()
  @ApiModelProperty({
    description: "偏移值",
    required: true
  })
  readonly offset: number;
}

export class createPerchaseDto {
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
    description: "商品清單(RFID tag ID list)",
    required: true
  })
  readonly product_list: string;

  @IsNotEmpty()
  @ApiModelProperty({
    description: "樂坊交易單號",
    required: true
  })
  readonly lefun_transaction_id: string;

  @IsNotEmpty()
  @ApiModelProperty({
    description: "呼叫開門api時回傳之驗證碼",
    required: true
  })
  readonly verify_token: string;

  @IsNotEmpty()
  @ApiModelProperty({
    description: "驗證簽章",
    required: true
  })
  readonly checksum: string;
}
