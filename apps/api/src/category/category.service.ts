import { Injectable } from '@nestjs/common';
import { CategoryNotFoundException } from '@triverr/api-exceptions';
import { Category } from '@triverr/api-interfaces';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCategoryById(id: string): Promise<Category> {
    const category = this.prismaService.category.findUnique({
      where: { id },
      include: {
        game: true
      }
    });

    if (!category) {
      throw new CategoryNotFoundException(id);
    }

    return category;
  }

  async getCategoryByTitle(title: string): Promise<Category> {
    const category = this.prismaService.category.findUnique({
      where: { title },
      include: {
        game: true
      }
    });

    if (!category) {
      throw new CategoryNotFoundException(title, 'title');
    }

    return category;
  }

  async getCategories(): Promise<Category[]> {
    return this.prismaService.category.findMany({
      orderBy: { title: 'asc' },
      include: {
        game: true
      }
    });
  }

  async getCategoriesByAuthor(author: string): Promise<Category[]> {
    return this.prismaService.category.findMany({
      orderBy: { title: 'asc' },
      where: { author },
      include: {
        game: true
      }
    });
  }

  async getCategoriesByGame(gameId: string): Promise<Category[]> {
    return this.prismaService.category.findMany({
      orderBy: { title: 'asc' },
      where: { gameId },
      include: {
        game: true
      }
    });
  }
}
