import { Injectable } from '@nestjs/common';
import { GameNotFoundException } from '@triverr/api-exceptions';
import { Game } from '@triverr/api-interfaces';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prismaService: PrismaService) {}

  async getGameById(id: string): Promise<Game> {
    const game = this.prismaService.game.findUnique({ where: { id } });

    if (!game) {
      throw new GameNotFoundException(id);
    }

    return game;
  }

  async getGameByTitle(title: string): Promise<Game> {
    const game = this.prismaService.game.findUnique({ where: { title } });

    if (!game) {
      throw new GameNotFoundException(title, 'title');
    }

    return game;
  }

  async getGames(): Promise<Game[]> {
    return this.prismaService.game.findMany({ orderBy: { title: 'asc' } });
  }

  async getGamesByAuthor(author: string): Promise<Game[]> {
    return this.prismaService.game.findMany({
      orderBy: { title: 'asc' },
      where: { author }
    });
  }
}
