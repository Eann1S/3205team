import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { ShortUrl } from './entity/shorturl.entity';
import { CreateShortUrlDto } from './dto/create.shorturl.dto';
import { StatisticsService } from '../statistics/statistics.service';
import * as base62 from 'base62';

@Injectable()
export class ShorturlService {
  constructor(
    @InjectRepository(ShortUrl)
    private shortUrlRepository: Repository<ShortUrl>,
    private statisticsService: StatisticsService,
  ) {}

  async shortenUrl(createShortUrlDto: CreateShortUrlDto) {
    const { originalUrl, alias, expirationDate } = createShortUrlDto;

    const existingUrl = await this.shortUrlRepository.findOne({
      where: { originalUrl },
    });
    if (existingUrl) {
      return existingUrl;
    }

    if (alias) {
      const existing = await this.shortUrlRepository.findOne({
        where: { shortKey: alias },
      });
      if (existing) {
        throw new ConflictException('Alias is already in use');
      }
    }

    let shortKey = alias;
    if (!shortKey) {
      const generateKey = () => {
        const randomBytes = crypto.randomBytes(16).toString('hex');
        const num = Buffer.from(randomBytes, 'hex').readBigUInt64BE();
        return base62.encode(Number(num));
      };

      do {
        shortKey = generateKey();
      } while (await this.shortUrlRepository.findOne({ where: { shortKey } }));
    }

    const shortUrl = this.shortUrlRepository.create({
      originalUrl,
      shortKey,
      expirationDate,
    });
    return this.shortUrlRepository.save(shortUrl);
  }

  async getShortUrl(shortKey: string, ip: string) {
    const shortUrl = await this.shortUrlRepository.findOne({
      where: { shortKey },
    });
    if (!shortUrl) {
      throw new NotFoundException('Short URL not found');
    }
    shortUrl.clicks++;
    await this.shortUrlRepository.save(shortUrl);
    await this.statisticsService.createStatistics({
      shortUrlId: shortUrl.id,
      ipAddress: ip,
    });
    return shortUrl;
  }

  async getInfo(shortKey: string) {
    const shortUrl = await this.shortUrlRepository.findOne({
      where: { shortKey },
    });
    if (!shortUrl) {
      throw new NotFoundException('Short URL not found');
    }
    return shortUrl;
  }

  async getStats(shortKey: string) {
    const shortUrl = await this.shortUrlRepository.findOne({
      where: { shortKey },
      relations: ['statistics'],
    });
    if (!shortUrl) {
      throw new NotFoundException('Short URL not found');
    }
    return {
      ...shortUrl.statistics,
      clicks: shortUrl.clicks,
    };
  }

  async deleteUrl(shortKey: string) {
    const shortUrl = await this.shortUrlRepository.findOne({
      where: { shortKey },
    });
    if (!shortUrl) {
      throw new NotFoundException('Short URL not found');
    }
    await this.shortUrlRepository.delete(shortUrl.id);
  }
}
