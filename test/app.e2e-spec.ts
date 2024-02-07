import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import mongoose from 'mongoose';
import { ConfigModule } from '@nestjs/config';

describe('User and Auth Controllers (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
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

  it('process.env.NODE_ENV should be defined', () => {
    console.log(process.env.NODE_ENV);
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it('process.env.JWT_SECRET should be defined', () => {
    console.log(process.env.JWT_SECRET);
    expect(process.env.JWT_SECRET).toBeDefined();
  });

  it('POST - Register a new user with missing credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: user.name })
      .expect(400);
  });

  it('POST - Register a valid new user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(201);
  });

  it('POST - Register a new user with existing mail', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(403);
  });

  it('POST - Login a user with wrong credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, hashed_password: '123' })
      .expect(401);
  });

  it('POST - Login a user with missing credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email })
      .expect(400);
  });

  it('POST - Login a user', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, hashed_password: user.hashed_password })
      .expect(201)
      .expect((res) => {
        expect(res.body.access_token).toBeDefined();
        authToken = res.body.access_token;
      });
  });

  it('GET - Trying to access an unauthorised route', () => {
    return request(app.getHttpServer()).get('/users').expect(401);
  });

  it('GET - Trying to access an unauthorised route with a valid token', () => {
    expect(authToken).toBeDefined();
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});
