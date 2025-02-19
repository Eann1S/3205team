import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDate, IsUrl } from 'class-validator';

export class ShortUrlDto {
  @ApiProperty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsUrl()
  originalUrl: string;

  @ApiProperty()
  shortKey: string;

  @ApiProperty()
  clicks: number;

  @IsNotEmpty()
  @ApiProperty()
  expirationDate: Date;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  createdAt: Date;
}
