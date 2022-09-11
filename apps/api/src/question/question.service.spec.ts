import { Test, TestingModule } from '@nestjs/testing';
import { QuestionNotFoundException } from '@triverr/api-exceptions';
import { Question } from '@triverr/api-interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { QuestionService } from './question.service';
import cuid = require('cuid');

describe('QuestionService', () => {
  let service: QuestionService;
  let prismaService: PrismaService;
  const defaultBaseQuestion = {
    id: cuid(),
    content: 'Does this work?',
    answerIndex: 1,
    answers: 'Yes|No',
    author: 'User 1',
    active: true,
    category: {
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
      providers: [QuestionService, PrismaService]
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('when getting a question by id', () => {
    it('should return the question if found', async () => {
      const questionId = cuid();
      const mockValue: Question = { ...defaultBaseQuestion, id: questionId };
      const getQuestionByIdSpy = jest.spyOn(service, 'getQuestionById');

      prismaService.question.findUnique = jest.fn().mockResolvedValueOnce(mockValue);

      await expect(service.getQuestionById(questionId)).resolves.toStrictEqual(
        mockValue
      );
      expect(getQuestionByIdSpy).toBeCalledWith(questionId);
    });

    it('should throw an error if not found', async () => {
      const questionId = cuid();
      const getQuestionByIdSpy = jest.spyOn(service, 'getQuestionById');

      prismaService.question.findUnique = jest.fn().mockReturnValueOnce(undefined);

      await expect(service.getQuestionById(questionId)).rejects.toThrowError(
        QuestionNotFoundException
      );
      expect(getQuestionByIdSpy).toBeCalledWith(questionId);
    });
  });

  describe('when getting questions', () => {
    it('should return the list of questions', async () => {
      const mockValue: Question[] = [defaultBaseQuestion];
      const getQuestionsSpy = jest.spyOn(service, 'getQuestions');

      prismaService.question.findMany = jest.fn().mockResolvedValueOnce(mockValue);

      await expect(service.getQuestions()).resolves.toStrictEqual(mockValue);
      expect(getQuestionsSpy).toBeCalled();
    });
  });

  describe('when getting questions by author', () => {
    it('should return the list of questions', async () => {
      const author = 'User 1';
      const mockValue: Question[] = [defaultBaseQuestion];
      const getCategoriesByAuthorSpy = jest.spyOn(service, 'getQuestionsByAuthor');

      prismaService.question.findMany = jest.fn().mockResolvedValueOnce(mockValue);

      await expect(service.getQuestionsByAuthor(author)).resolves.toStrictEqual(
        mockValue
      );
      expect(getCategoriesByAuthorSpy).toBeCalledWith(author);
    });
  });

  describe('when getting questions by category', () => {
    it('should return the list of questions', async () => {
      const categoryId = defaultBaseQuestion.category.id;
      const mockValue: Question[] = [defaultBaseQuestion];
      const getQuestionsByCategorySpy = jest.spyOn(service, 'getQuestionsByCategory');

      prismaService.question.findMany = jest.fn().mockResolvedValueOnce(mockValue);

      await expect(service.getQuestionsByCategory(categoryId)).resolves.toStrictEqual(
        mockValue
      );
      expect(getQuestionsByCategorySpy).toBeCalledWith(categoryId);
    });
  });

  describe('when getting questions by game', () => {
    it('should return the list of questions', async () => {
      const gameId = defaultBaseQuestion.game.id;
      const mockValue: Question[] = [defaultBaseQuestion];
      const getQuestionsByGameSpy = jest.spyOn(service, 'getQuestionsByGame');

      prismaService.question.findMany = jest.fn().mockResolvedValueOnce(mockValue);

      await expect(service.getQuestionsByGame(gameId)).resolves.toStrictEqual(
        mockValue
      );
      expect(getQuestionsByGameSpy).toBeCalledWith(gameId);
    });
  });
});
