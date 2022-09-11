import { Category } from './category.interface';
import { Game } from './game.interface';

export interface Question {
  id: string;
  content: string;
  answerIndex: number;
  answers: string[];
  author: string;
  active: boolean;
  category: Category;
  game: Game;
  createdAt: Date;
  updatedAt: Date;
}
