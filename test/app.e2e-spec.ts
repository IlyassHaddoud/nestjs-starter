import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import mongoose from 'mongoose';

describe('User and Auth Controllers (e2e)', () => {
  let app: INestApplication;
  const user = {
    name: 'ilyass',
    email: 'ilyass@mail.com',
    hashed_password: 'ilyass1234',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL);
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('POST - Register a new user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(201);
  });

  it('POST - Login a user', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, hashed_password: user.hashed_password })
      .expect(200)
      .expect((res) => {
        expect(res.body.access_token).toBeDefined();
      });
  });
});
