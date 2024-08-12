import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ModalAlertaController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/modal-alertas (GET)', () => {
    it('should return all modal alertas', async () => {
      return request(app.getHttpServer())
        .get('/modal-alertas')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('Success', true);
          expect(res.body).toHaveProperty('Status', 200);
          expect(res.body).toHaveProperty('Message', 'Request successful');
          expect(res.body).toHaveProperty('Data');
          expect(Array.isArray(res.body.Data)).toBe(true);
          expect(res.body.Data.length).toBeGreaterThan(0);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
