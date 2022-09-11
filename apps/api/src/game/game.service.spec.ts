import { Test, TestingModule } from '@nestjs/testing';
import { GameNotFoundException } from '@triverr/api-exceptions';
import { Game } from '@triverr/api-interfaces';
import * as cuid from 'cuid';
import { PrismaService } from '../prisma/prisma.service';
import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;
  let prismaService: PrismaService;
  const defaultBaseGame = {
    id: cuid(),
    title: 'Game 1',
    active: true,
    author: 'User 1',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService, PrismaService]
    }).compile();

    service = module.get<GameService>(GameService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('when getting a game by id', () => {
    it('should return the game if found', async () => {
      const gameId = cuid();
      const mockValue: Game = { ...defaultBaseGame, id: gameId };
      const getGameByIdSpy = jest.spyOn(service, 'getGameById');

      prismaService.game.findUnique = jest.fn().mockResolvedValueOnce(mockValue);

      await expect(service.getGameById(gameId)).resolves.toStrictEqual(mockValue);
      expect(getGameByIdSpy).toBeCalledWith(gameId);
    });

    it('should throw an error if not found', async () => {
      const gameId = cuid();
      const getGameByIdSpy = jest.spyOn(service, 'getGameById');

      prismaService.game.findUnique = jest.fn().mockReturnValueOnce(undefined);

      await expect(service.getGameById(gameId)).rejects.toThrowError(
        GameNotFoundException
      );
      expect(getGameByIdSpy).toBeCalledWith(gameId);
    });
  });

  describe('when getting a game by title', () => {
    it('should return the game if found', async () => {
      const gameTitle = 'Game 1';
      const mockValue: Game = { ...defaultBaseGame, title: gameTitle };
      const getGameByTitleSpy = jest.spyOn(service, 'getGameByTitle');

      prismaService.game.findUnique = jest.fn().mockResolvedValueOnce(mockValue);

      await expect(service.getGameByTitle(gameTitle)).resolves.toStrictEqual(mockValue);
      expect(getGameByTitleSpy).toBeCalledWith(gameTitle);
    });

    it('should throw an error if not found', async () => {
      const getGameByTitleSpy = jest.spyOn(service, 'getGameByTitle');

      prismaService.game.findUnique = jest.fn().mockReturnValueOnce(undefined);

      await expect(service.getGameByTitle('Game 1')).rejects.toThrowError(
        GameNotFoundException
      );
      expect(getGameByTitleSpy).toBeCalledWith('Game 1');
    });
  });

  describe('when getting games', () => {
    it('should return the list of games', async () => {
      const mockValue: Game[] = [defaultBaseGame];
      const getGamesSpy = jest.spyOn(service, 'getGames');

      prismaService.game.findMany = jest.fn().mockResolvedValueOnce(mockValue);

      await expect(service.getGames()).resolves.toStrictEqual(mockValue);
      expect(getGamesSpy).toBeCalled();
    });
  });

  describe('when getting games by author', () => {
    it('should return the list of games', async () => {
      const author = 'User 1';
      const mockValue: Game[] = [defaultBaseGame];
      const getGamesByAuthorSpy = jest.spyOn(service, 'getGamesByAuthor');

      prismaService.game.findMany = jest.fn().mockResolvedValueOnce(mockValue);

      await expect(service.getGamesByAuthor(author)).resolves.toStrictEqual(mockValue);
      expect(getGamesByAuthorSpy).toBeCalledWith(author);
    });
  });
});
