import { ApiProperty } from '@nestjs/swagger';

export class StatisticsDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  ipAddress: string;

  @ApiProperty()
  clickedAt: Date;

  @ApiProperty()
  shortUrlId: number;
}
