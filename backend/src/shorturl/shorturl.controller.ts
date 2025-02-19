import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Ip,
  Delete,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShorturlService } from './shorturl.service';
import { CreateShortUrlDto } from './dto/create.shorturl.dto';

@ApiTags('Short URL')
@Controller('')
export class ShorturlController {
  constructor(private readonly shorturlService: ShorturlService) {}

  @Post('shorten')
  @ApiOperation({ summary: 'Create a new short URL' })
  async shortenUrl(@Body() dto: CreateShortUrlDto) {
    return this.shorturlService.shortenUrl(dto);
  }

  @Get(':shortUrl')
  @ApiOperation({ summary: 'Redirect to the original URL' })
  async redirectToOriginalUrl(
    @Param('shortUrl') shortUrl: string,
    @Ip() ip: string,
    @Res() res: Response,
  ) {
    const result = await this.shorturlService.getShortUrl(shortUrl, ip);
    res.redirect(result.originalUrl);
  }

  @Get('info/:shortUrl')
  @ApiOperation({ summary: 'Get information about a short URL' })
  async getInfo(@Param('shortUrl') shortUrl: string) {
    return this.shorturlService.getInfo(shortUrl);
  }

  @Get('stats/:shortUrl')
  @ApiOperation({ summary: 'Get statistics about a short URL' })
  async getStats(@Param('shortUrl') shortUrl: string) {
    return this.shorturlService.getStats(shortUrl);
  }

  @Delete(':shortUrl')
  @ApiOperation({ summary: 'Delete a short URL' })
  async deleteUrl(@Param('shortUrl') shortUrl: string) {
    return this.shorturlService.deleteUrl(shortUrl);
  }
}
