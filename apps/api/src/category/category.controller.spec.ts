import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '@triverr/api-interfaces';
import * as cuid from 'cuid';
import * as moment from 'moment';
import * as request from 'supertest';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
  let app: INestApplication;
  const defaultBaseCategory: Category = {
    id: cuid(),
    title: 'Category 1',
    active: true,
    author: 'User 1',
    game: {
      id: cuid(),
      title: 'Game 1',
      active: true,
      author: 'User 1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        CategoryService,
        {
          provide: PrismaService,
          useValue: {
            category: {
              findUnique: jest.fn().mockResolvedValueOnce(defaultBaseCategory),
              findMany: jest.fn().mockResolvedValueOnce([defaultBaseCategory])
            }
          }
        }
      ]
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    await app.init();
  });

  describe('when getting a category by id', () => {
    it('should return the category if found', async () => {
      const resp = await request(app.getHttpServer()).get(
        `/category/${defaultBaseCategory.id}`
      );

      expect(resp.status).toEqual(HttpStatus.OK);
      expect(formatBody(resp.body as Category)).toEqual(defaultBaseCategory);
    });
  });

  describe('when getting a category by title', () => {
    it('should return the category if found', async () => {
      const resp = await request(app.getHttpServer()).get(
        `/category/title/${defaultBaseCategory.title}`
      );

      expect(resp.status).toEqual(HttpStatus.OK);
      expect(formatBody(resp.body as Category)).toEqual(defaultBaseCategory);
    });
  });

  describe('when getting categories', () => {
    it('should return the list of categories', async () => {
      const resp = await request(app.getHttpServer()).get('/category');

      expect(resp.status).toEqual(HttpStatus.OK);
      expect(formatBody(resp.body as Category)).toEqual([defaultBaseCategory]);
    });
  });

  describe('when getting categories by author', () => {
    it('should return the list of categories', async () => {
      const resp = await request(app.getHttpServer()).get(
        `/category/author/${defaultBaseCategory.author}`
      );

      expect(resp.status).toEqual(HttpStatus.OK);
      expect(formatBody(resp.body as Category)).toEqual([defaultBaseCategory]);
    });
  });

  describe('when getting categories by game', () => {
    it('should return the list of categories', async () => {
      const resp = await request(app.getHttpServer()).get(
        `/category/game/${defaultBaseCategory.game.id}`
      );

      expect(resp.status).toEqual(HttpStatus.OK);
      expect(formatBody(resp.body as Category)).toEqual([defaultBaseCategory]);
    });
  });
});

function formatBody(category: Category | Category[]): Category | Category[] {
  if (Array.isArray(category)) {
    category.forEach((g) => {
      g.createdAt = moment(g.createdAt).toDate();
      g.updatedAt = moment(g.updatedAt).toDate();
      g.game.createdAt = moment(g.game.createdAt).toDate();
      g.game.updatedAt = moment(g.game.updatedAt).toDate();
    });
  } else {
    category.createdAt = moment(category.createdAt).toDate();
    category.updatedAt = moment(category.updatedAt).toDate();
    category.game.createdAt = moment(category.game.createdAt).toDate();
    category.game.updatedAt = moment(category.game.updatedAt).toDate();
  }

  return category;
}
