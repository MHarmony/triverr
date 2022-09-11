import { NotFoundException } from '@nestjs/common';

export class GameNotFoundException extends NotFoundException {
  constructor(fieldValue: string, fieldName = 'id') {
    super(`Game with ${fieldName} "${fieldValue}" not found`);
  }
}
