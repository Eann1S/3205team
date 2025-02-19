import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statistics } from './entity/statistics.entity';
@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistics)
    private statisticsRepository: Repository<Statistics>,
  ) {}

  async createStatistics({
    shortUrlId,
    ipAddress,
  }: {
    shortUrlId: number;
    ipAddress: string;
  }) {
    const statistics = this.statisticsRepository.create({
      shortUrlId,
      ipAddress,
    });
    return this.statisticsRepository.save(statistics);
  }

  async getStatistics(shortUrlId: number) {
    return this.statisticsRepository.find({ where: { shortUrlId } });
  }

  async getStatisticsByIpAddress(ipAddress: string) {
    return this.statisticsRepository.find({ where: { ipAddress } });
  }
}
