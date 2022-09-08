import { Game } from './game';

export interface Category {
  id: string;
  title: string;
  active: boolean;
  author: string;
  game: Game;
  createdAt: Date;
  updatedAt: Date;
}
