import { IsNotEmpty, IsNumberString } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";

export class findAllDto {
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

export class findContentDto {
  @IsNotEmpty()
  @IsNumberString()
  @ApiModelProperty({
    description: "消息編號",
    required: true
  })
  readonly id: string;
}
