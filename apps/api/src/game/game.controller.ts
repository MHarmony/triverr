import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { Game } from '@triverr/api-interfaces';
import { GameService } from './game.service';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':id')
  @ApiOperation({ description: 'Get a game by id', summary: 'Get a game by id' })
  @ApiOkResponse({ description: 'Successfully retrieved the game' })
  @ApiNotFoundResponse({ description: 'The game was not found' })
  @ApiParam({ name: 'id', type: 'string', format: 'cuid' })
  async getGameById(@Param('id') id: string): Promise<Game> {
    return this.gameService.getGameById(id);
  }

  @Get('title/:title')
  @ApiOperation({ description: 'Get a game by title', summary: 'Get a game by title' })
  @ApiOkResponse({ description: 'Successfully retrieved the game' })
  @ApiNotFoundResponse({ description: 'The game was not found' })
  async getGameByTitle(@Param('title') title: string): Promise<Game> {
    return this.gameService.getGameByTitle(title);
  }

  @Get()
  @ApiOperation({ description: 'Get all games', summary: 'Get all games' })
  @ApiOkResponse({ description: 'Successfully retrieved all games', isArray: true })
  async getGames(): Promise<Game[]> {
    return this.gameService.getGames();
  }

  @Get('author/:author')
  @ApiOperation({
    description: 'Get all games by author',
    summary: 'Get all games by author'
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all games for the author',
    isArray: true
  })
  async getGamesByAuthor(@Param('author') author: string): Promise<Game[]> {
    return this.gameService.getGamesByAuthor(author);
  }
}
