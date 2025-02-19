import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statistics } from './entity/statistics.entity';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Statistics])],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
