import { NotFoundException } from '@nestjs/common';

export class CategoryNotFoundException extends NotFoundException {
  constructor(fieldValue: string, fieldName = 'id') {
    super(`Category with ${fieldName} "${fieldValue}" not found`);
  }
}
