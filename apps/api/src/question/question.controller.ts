import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { Question } from '@triverr/api-interfaces';
import { QuestionService } from './question.service';

@Controller('question')
@ApiTags('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get(':id')
  @ApiOperation({
    description: 'Get a question by id',
    summary: 'Get a question by id'
  })
  @ApiOkResponse({ description: 'Successfully retrieved the question' })
  @ApiNotFoundResponse({ description: 'The question was not found' })
  @ApiParam({ name: 'id', type: 'string', format: 'cuid' })
  async getGameById(@Param('id') id: string): Promise<Question> {
    return this.questionService.getQuestionById(id);
  }

  @Get()
  @ApiOperation({ description: 'Get all questions', summary: 'Get all questions' })
  @ApiOkResponse({
    description: 'Successfully retrieved all questions',
    isArray: true
  })
  async getGames(): Promise<Question[]> {
    return this.questionService.getQuestions();
  }

  @Get('author/:author')
  @ApiOperation({
    description: 'Get all questions by author',
    summary: 'Get all questions by author'
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all questions for the author',
    isArray: true
  })
  async getGamesByAuthor(@Param('author') author: string): Promise<Question[]> {
    return this.questionService.getQuestionsByAuthor(author);
  }

  @Get('category/:categoryId')
  @ApiOperation({
    description: 'Get all questions by category',
    summary: 'Get all questions by category'
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all questions for the category',
    isArray: true
  })
  async getQuestionsByCategory(
    @Param('categoryId') categoryId: string
  ): Promise<Question[]> {
    return this.questionService.getQuestionsByCategory(categoryId);
  }

  @Get('game/:gameId')
  @ApiOperation({
    description: 'Get all questions by game',
    summary: 'Get all questions by game'
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all questions for the game',
    isArray: true
  })
  async getQuestionsByGame(@Param('gameId') gameId: string): Promise<Question[]> {
    return this.questionService.getQuestionsByGame(gameId);
  }
}
