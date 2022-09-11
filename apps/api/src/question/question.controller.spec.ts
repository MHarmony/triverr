import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Question } from '@triverr/api-interfaces';
import * as cuid from 'cuid';
import * as moment from 'moment';
import * as request from 'supertest';
import { PrismaService } from '../prisma/prisma.service';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

describe('QuestionController', () => {
  let app: INestApplication;
  const defaultBaseQuestion: Question = {
    id: cuid(),
    content: 'Does this work?',
    answerIndex: 1,
    answers: 'Yes|No',
    author: 'User 1',
    active: true,
    category: {
      id: cuid(),
      title: 'Question 1',
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
    },
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
      controllers: [QuestionController],
      providers: [
        QuestionService,
        {
          provide: PrismaService,
          useValue: {
            question: {
              findUnique: jest.fn().mockResolvedValueOnce(defaultBaseQuestion),
              findMany: jest.fn().mockResolvedValueOnce([defaultBaseQuestion])
            }
          }
        }
      ]
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    await app.init();
  });

  describe('when getting a question by id', () => {
    it('should return the question if found', async () => {
      const resp = await request(app.getHttpServer()).get(
        `/question/${defaultBaseQuestion.id}`
      );

      expect(resp.status).toEqual(HttpStatus.OK);
      expect(formatBody(resp.body as Question)).toEqual(defaultBaseQuestion);
    });
  });

  describe('when getting questions', () => {
    it('should return the list of questions', async () => {
      const resp = await request(app.getHttpServer()).get('/question');

      expect(resp.status).toEqual(HttpStatus.OK);
      expect(formatBody(resp.body as Question)).toEqual([defaultBaseQuestion]);
    });
  });

  describe('when getting questions by author', () => {
    it('should return the list of questions', async () => {
      const resp = await request(app.getHttpServer()).get(
        `/question/author/${defaultBaseQuestion.author}`
      );

      expect(resp.status).toEqual(HttpStatus.OK);
      expect(formatBody(resp.body as Question)).toEqual([defaultBaseQuestion]);
    });
  });

  describe('when getting questions by category', () => {
    it('should return the list of questions', async () => {
      const resp = await request(app.getHttpServer()).get(
        `/question/category/${defaultBaseQuestion.category.id}`
      );

      expect(resp.status).toEqual(HttpStatus.OK);
      expect(formatBody(resp.body as Question)).toEqual([defaultBaseQuestion]);
    });
  });

  describe('when getting questions by game', () => {
    it('should return the list of questions', async () => {
      const resp = await request(app.getHttpServer()).get(
        `/question/game/${defaultBaseQuestion.game.id}`
      );

      expect(resp.status).toEqual(HttpStatus.OK);
      expect(formatBody(resp.body as Question)).toEqual([defaultBaseQuestion]);
    });
  });
});

function formatBody(question: Question | Question[]): Question | Question[] {
  if (Array.isArray(question)) {
    question.forEach((g) => {
      g.createdAt = moment(g.createdAt).toDate();
      g.updatedAt = moment(g.updatedAt).toDate();
      g.game.createdAt = moment(g.game.createdAt).toDate();
      g.game.updatedAt = moment(g.game.updatedAt).toDate();
      g.category.createdAt = moment(g.category.createdAt).toDate();
      g.category.updatedAt = moment(g.category.updatedAt).toDate();
      g.category.game.createdAt = moment(g.category.game.createdAt).toDate();
      g.category.game.updatedAt = moment(g.category.game.updatedAt).toDate();
    });
  } else {
    question.createdAt = moment(question.createdAt).toDate();
    question.updatedAt = moment(question.updatedAt).toDate();
    question.game.createdAt = moment(question.game.createdAt).toDate();
    question.game.updatedAt = moment(question.game.updatedAt).toDate();
    question.category.createdAt = moment(question.category.createdAt).toDate();
    question.category.updatedAt = moment(question.category.updatedAt).toDate();
    question.category.game.createdAt = moment(
      question.category.game.createdAt
    ).toDate();
    question.category.game.updatedAt = moment(
      question.category.game.updatedAt
    ).toDate();
  }

  return question;
}
