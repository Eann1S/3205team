import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { ShortUrlDto } from './shorturl.dto';
import { IsString } from 'class-validator';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateShortUrlDto extends OmitType(ShortUrlDto, [
  'id',
  'shortKey',
  'clicks',
  'createdAt',
  'expirationDate',
] as const) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alias?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  expirationDate?: Date;
}
