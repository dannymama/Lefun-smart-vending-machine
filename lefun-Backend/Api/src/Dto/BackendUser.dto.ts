import {
  IsNotEmpty,
  IsNumberString,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";
import { isString, isNumber } from "util";

export class findAllDto {
  @IsNotEmpty()
  @IsNumberString()
  readonly limit: number;

  @IsNotEmpty()
  @IsNumberString()
  readonly offset: number;
}

export class createDto {
  @IsNotEmpty()
  readonly account: string;
  @IsNotEmpty()
  readonly password: string;
  @IsNotEmpty()
  @IsNumber()
  readonly type: number;
}

export class loginDto {
  @IsNotEmpty()
  readonly account: string;
  @IsNotEmpty()
  readonly password: string;
}

export class deleteDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
}

export class updateDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
  @IsOptional()
  @IsString()
  readonly account: string;
  @IsOptional()
  @IsString()
  readonly password: string;
  @IsOptional()
  @IsNumber()
  readonly type: number;
}
