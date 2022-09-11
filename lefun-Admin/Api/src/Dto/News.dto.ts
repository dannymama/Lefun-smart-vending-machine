import {
  IsNotEmpty,
  IsNumberString,
  IsNumber,
  IsOptional
} from "class-validator";

export class findAllDto {
  @IsNotEmpty()
  @IsNumberString()
  readonly limit: number;

  @IsNotEmpty()
  @IsNumberString()
  readonly offset: number;
}

export class findContentDto {
  @IsNotEmpty()
  @IsNumberString()
  readonly id: string;
}

export class createDto {
  @IsNotEmpty()
  readonly title: string;
  @IsOptional()
  readonly sub_title: string;
  @IsOptional()
  readonly context: string;
  @IsOptional()
  readonly imageURL: string;
  @IsNotEmpty()
  readonly isHot: string;
}

export class updateDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
  @IsNotEmpty()
  readonly title: string;
  @IsNotEmpty()
  readonly sub_title: string;
  @IsOptional()
  readonly context: string;
  @IsOptional()
  readonly imageURL: string;
  @IsNotEmpty()
  readonly isHot: string;
}

export class deleteDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
}
