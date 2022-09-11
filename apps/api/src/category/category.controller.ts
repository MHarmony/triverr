import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { Category } from '@triverr/api-interfaces';
import { CategoryService } from './category.service';

@Controller('category')
@ApiTags('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get(':id')
  @ApiOperation({
    description: 'Get a category by id',
    summary: 'Get a category by id'
  })
  @ApiOkResponse({ description: 'Successfully retrieved the category' })
  @ApiNotFoundResponse({ description: 'The category was not found' })
  @ApiParam({ name: 'id', type: 'string', format: 'cuid' })
  async getGameById(@Param('id') id: string): Promise<Category> {
    return this.categoryService.getCategoryById(id);
  }

  @Get('title/:title')
  @ApiOperation({
    description: 'Get a category by title',
    summary: 'Get a category by title'
  })
  @ApiOkResponse({ description: 'Successfully retrieved the category' })
  @ApiNotFoundResponse({ description: 'The category was not found' })
  async getGameByTitle(@Param('title') title: string): Promise<Category> {
    return this.categoryService.getCategoryByTitle(title);
  }

  @Get()
  @ApiOperation({ description: 'Get all categories', summary: 'Get all categories' })
  @ApiOkResponse({
    description: 'Successfully retrieved all categories',
    isArray: true
  })
  async getGames(): Promise<Category[]> {
    return this.categoryService.getCategories();
  }

  @Get('author/:author')
  @ApiOperation({
    description: 'Get all categories by author',
    summary: 'Get all categories by author'
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all categories for the author',
    isArray: true
  })
  async getGamesByAuthor(@Param('author') author: string): Promise<Category[]> {
    return this.categoryService.getCategoriesByAuthor(author);
  }

  @Get('game/:gameId')
  @ApiOperation({
    description: 'Get all categories by game',
    summary: 'Get all categories by game'
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all categories for the game',
    isArray: true
  })
  async getCategoriesByGame(@Param('gameId') gameId: string): Promise<Category[]> {
    return this.categoryService.getCategoriesByGame(gameId);
  }
}
