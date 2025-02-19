import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShortUrl } from '../../shorturl/entity/shorturl.entity';
@Entity()
export class Statistics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shortUrlId: number;

  @Column()
  ipAddress: string;

  @CreateDateColumn()
  clickedAt: Date;

  @OneToOne(() => ShortUrl, (shortUrl) => shortUrl.statistics)
  @JoinColumn({ name: 'shortUrlId' })
  shortUrl: ShortUrl;
}
