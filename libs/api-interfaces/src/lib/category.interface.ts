import { Game } from './game.interface';

export interface Category {
  id: string;
  title: string;
  active: boolean;
  author: string;
  game: Game;
  createdAt: Date;
  updatedAt: Date;
}
