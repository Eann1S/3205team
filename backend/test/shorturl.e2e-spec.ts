import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

describe('ShortUrlController (e2e)', () => {
  let app: INestApplication;
  const testUrl = 'https://www.example.com';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('TypeOrmModuleOptions')
      .useValue({
        type: 'sqlite',
        database: ':memory:',
        entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
        synchronize: true,
        dropSchema: true,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /shorturl', () => {
    it('should create a short URL', async () => {
      const response = await request(app.getHttpServer())
        .post('/shorten')
        .send({
          originalUrl: testUrl,
          alias: 'test',
          expirationDate: '2025-01-01',
        })
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        originalUrl: testUrl,
        shortKey: 'test',
        expirationDate: expect.stringContaining('2025-01-01'),
        clicks: 0,
      });
    });

    it('should return 400 for invalid URL', async () => {
      await request(app.getHttpServer())
        .post('/shorten')
        .accept('application/json')
        .send({ originalUrl: '' })
        .expect(400);
    });

    it('should return the same short URL for duplicate requests', async () => {
      const firstResponse = await request(app.getHttpServer())
        .post('/shorten')
        .send({ originalUrl: testUrl });

      const secondResponse = await request(app.getHttpServer())
        .post('/shorten')
        .send({ originalUrl: testUrl });

      expect(firstResponse.body.shortKey).toEqual(secondResponse.body.shortKey);
    });
  });

  describe('GET /:shortUrl', () => {
    it('should redirect to original URL', async () => {
      const creationResponse = await request(app.getHttpServer())
        .post('/shorten')
        .send({ originalUrl: testUrl });

      await request(app.getHttpServer())
        .get(`/${creationResponse.body.shortKey}`)
        .expect(302)
        .expect('Location', testUrl);
    });

    it('should return 404 for non-existent short URL', async () => {
      await request(app.getHttpServer()).get('/nonexistent').expect(404);
    });
  });

  describe('GET /:shortUrl/statistics', () => {
    it('should return visit statistics', async () => {
      const creationResponse = await request(app.getHttpServer())
        .post('/shorten')
        .send({ originalUrl: testUrl });

      await request(app.getHttpServer()).get(
        `/${creationResponse.body.shortKey}`,
      );
      await request(app.getHttpServer()).get(
        `/${creationResponse.body.shortKey}`,
      );

      const statsResponse = await request(app.getHttpServer())
        .get(`/stats/${creationResponse.body.shortKey}`)
        .expect(200);

      expect(statsResponse.body).toMatchObject({
        shortUrlId: creationResponse.body.id,
      });
    });

    it('should return 404 for non-existent short URL statistics', async () => {
      await request(app.getHttpServer())
        .get('/nonexistent/statistics')
        .expect(404);
    });
  });
});
