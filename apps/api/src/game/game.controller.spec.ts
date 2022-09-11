import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Game } from '@triverr/api-interfaces';
import * as cuid from 'cuid';
import * as moment from 'moment';
import * as request from 'supertest';
import { PrismaService } from '../prisma/prisma.service';
import { GameController } from './game.controller';
import { GameService } from './game.service';

describe('GameController', () => {
  let app: INestApplication;
  const defaultBaseGame: Game = {
    id: cuid(),
    title: 'Game 1',
    active: true,
    author: 'User 1',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        GameService,
        {
          provide: PrismaService,
          useValue: {
            game: {
              findUnique: jest.fn().mockResolvedValueOnce(defaultBaseGame),
              findMany: jest.fn().mockResolvedValueOnce([defaultBaseGame])
            }
          }
        }
      ]
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    await app.init();
  });

  describe('when getting a game by id', () => {
    it('should return the game if found', async () => {
      const resp = await request(app.getHttpServer()).get(
        `/game/${defaultBaseGame.id}`
      );

      expect(resp.status).toEqual(HttpStatus.OK);
      expect(formatBody(resp.body as Game)).toEqual(defaultBaseGame);
    });
  });

  describe('when getting a game by title', () => {
    it('should return the game if found', async () => {
      const resp = await request(app.getHttpServer()).get(
        `/game/title/${defaultBaseGame.title}`
      );

      expect(resp.status).toEqual(HttpStatus.OK);
      expect(formatBody(resp.body as Game)).toEqual(defaultBaseGame);
    });
  });

  describe('when getting games', () => {
    it('should return the list of games', async () => {
      const resp = await request(app.getHttpServer()).get('/game');

      expect(resp.status).toEqual(HttpStatus.OK);
      expect(formatBody(resp.body as Game)).toEqual([defaultBaseGame]);
    });
  });

  describe('when getting games by author', () => {
    it('should return the list of games', async () => {
      const resp = await request(app.getHttpServer()).get(
        `/game/author/${defaultBaseGame.author}`
      );

      expect(resp.status).toEqual(HttpStatus.OK);
      expect(formatBody(resp.body as Game)).toEqual([defaultBaseGame]);
    });
  });
});

function formatBody(game: Game | Game[]): Game | Game[] {
  if (Array.isArray(game)) {
    game.forEach((g) => {
      g.createdAt = moment(g.createdAt).toDate();
      g.updatedAt = moment(g.updatedAt).toDate();
    });
  } else {
    game.createdAt = moment(game.createdAt).toDate();
    game.updatedAt = moment(game.updatedAt).toDate();
  }

  return game;
}
