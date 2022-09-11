import { Injectable } from '@nestjs/common';
import { QuestionNotFoundException } from '@triverr/api-exceptions';
import { Question } from '@triverr/api-interfaces';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionService {
  constructor(private readonly prismaService: PrismaService) {}

  async getQuestionById(id: string): Promise<Question> {
    const question = this.prismaService.question.findUnique({
      where: { id },
      include: {
        game: true,
        category: {
          include: {
            game: true
          }
        }
      }
    });

    if (!question) {
      throw new QuestionNotFoundException(id);
    }

    return question;
  }

  async getQuestions(): Promise<Question[]> {
    return this.prismaService.question.findMany({
      include: {
        game: true,
        category: {
          include: {
            game: true
          }
        }
      }
    });
  }

  async getQuestionsByAuthor(author: string): Promise<Question[]> {
    return this.prismaService.question.findMany({
      where: { author },
      include: {
        game: true,
        category: {
          include: {
            game: true
          }
        }
      }
    });
  }

  async getQuestionsByCategory(categoryId: string): Promise<Question[]> {
    return this.prismaService.question.findMany({
      where: { categoryId },
      include: {
        game: true,
        category: {
          include: {
            game: true
          }
        }
      }
    });
  }

  async getQuestionsByGame(gameId: string): Promise<Question[]> {
    return this.prismaService.question.findMany({
      where: { gameId },
      include: {
        game: true,
        category: {
          include: {
            game: true
          }
        }
      }
    });
  }
}
