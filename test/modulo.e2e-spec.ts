import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ModuloController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/modulos (GET)', () => {
    it('should return all modulos', async () => {
      // Ensure there is at least one modulo in the database
      const newModulo = {
        nombre: 'Modulo Test',
        descripcion: 'Descripción del modulo test',
        sistema_id: 1,
        activo: true,
        fecha_creacion: new Date().toISOString(),
        fecha_modificacion: new Date().toISOString(),
      };

      await request(app.getHttpServer())
        .post('/modulos')
        .send(newModulo)
        .expect(201);

      // Now, perform the GET request
      return request(app.getHttpServer())
        .get('/modulos')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('Success', true);
          expect(res.body).toHaveProperty('Status', 200);
          expect(res.body).toHaveProperty('Message', 'Request successful');
          expect(res.body).toHaveProperty('Data');
          expect(Array.isArray(res.body.Data)).toBe(true);
          expect(res.body.Data.length).toBeGreaterThan(0); // Ensure there is at least one item
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
