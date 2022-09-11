import { Test, TestingModule } from '@nestjs/testing';
import { CategoryNotFoundException } from '@triverr/api-exceptions';
import { Category } from '@triverr/api-interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryService } from './category.service';
import cuid = require('cuid');

describe('CategoryService', () => {
  let service: CategoryService;
  let prismaService: PrismaService;
  const defaultBaseCategory = {
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
      providers: [CategoryService, PrismaService]
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('when getting a category by id', () => {
    it('should return the category if found', async () => {
      const categoryId = cuid();
      const mockValue: Category = { ...defaultBaseCategory, id: categoryId };
      const getCategoryByIdSpy = jest.spyOn(service, 'getCategoryById');

      prismaService.category.findUnique = jest.fn().mockResolvedValueOnce(mockValue);

      await expect(service.getCategoryById(categoryId)).resolves.toStrictEqual(
        mockValue
      );
      expect(getCategoryByIdSpy).toBeCalledWith(categoryId);
    });

    it('should throw an error if not found', async () => {
      const categoryId = cuid();
      const getCategoryByIdSpy = jest.spyOn(service, 'getCategoryById');

      prismaService.category.findUnique = jest.fn().mockReturnValueOnce(undefined);

      await expect(service.getCategoryById(categoryId)).rejects.toThrowError(
        CategoryNotFoundException
      );
      expect(getCategoryByIdSpy).toBeCalledWith(categoryId);
    });
  });

  describe('when getting a category by title', () => {
    it('should return the category if found', async () => {
      const categoryTitle = 'Category 1';
      const mockValue: Category = { ...defaultBaseCategory, title: categoryTitle };
      const getCategoryByTitleSpy = jest.spyOn(service, 'getCategoryByTitle');

      prismaService.category.findUnique = jest.fn().mockResolvedValueOnce(mockValue);

      await expect(service.getCategoryByTitle(categoryTitle)).resolves.toStrictEqual(
        mockValue
      );
      expect(getCategoryByTitleSpy).toBeCalledWith(categoryTitle);
    });

    it('should throw an error if not found', async () => {
      const getCategoryByTitleSpy = jest.spyOn(service, 'getCategoryByTitle');

      prismaService.category.findUnique = jest.fn().mockReturnValueOnce(undefined);

      await expect(service.getCategoryByTitle('Category 1')).rejects.toThrowError(
        CategoryNotFoundException
      );
      expect(getCategoryByTitleSpy).toBeCalledWith('Category 1');
    });
  });

  describe('when getting categories', () => {
    it('should return the list of categories', async () => {
      const mockValue: Category[] = [defaultBaseCategory];
      const getCategoriesSpy = jest.spyOn(service, 'getCategories');

      prismaService.category.findMany = jest.fn().mockResolvedValueOnce(mockValue);

      await expect(service.getCategories()).resolves.toStrictEqual(mockValue);
      expect(getCategoriesSpy).toBeCalled();
    });
  });

  describe('when getting categories by author', () => {
    it('should return the list of categories', async () => {
      const author = 'User 1';
      const mockValue: Category[] = [defaultBaseCategory];
      const getCategoriesByAuthorSpy = jest.spyOn(service, 'getCategoriesByAuthor');

      prismaService.category.findMany = jest.fn().mockResolvedValueOnce(mockValue);

      await expect(service.getCategoriesByAuthor(author)).resolves.toStrictEqual(
        mockValue
      );
      expect(getCategoriesByAuthorSpy).toBeCalledWith(author);
    });
  });
});
