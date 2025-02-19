import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortUrl } from './entity/shorturl.entity';
import { ShorturlService } from './shorturl.service';
import { ShorturlController } from './shorturl.controller';
import { StatisticsModule } from '../statistics/statistics.module';

@Module({
  imports: [TypeOrmModule.forFeature([ShortUrl]), StatisticsModule],
  controllers: [ShorturlController],
  providers: [ShorturlService],
  exports: [ShorturlService],
})
export class ShorturlModule {}
