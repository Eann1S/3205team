import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Statistics } from '../../statistics/entity/statistics.entity';
@Entity()
export class ShortUrl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalUrl: string;

  @Column()
  @Index({ unique: true })
  shortKey: string;

  @Column({ default: 0 })
  clicks: number;

  @Column({ nullable: true })
  expirationDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Statistics, (statistics) => statistics.shortUrl)
  statistics: Statistics;
}
