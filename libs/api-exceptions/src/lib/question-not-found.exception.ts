import { NotFoundException } from '@nestjs/common';

export class QuestionNotFoundException extends NotFoundException {
  constructor(fieldValue: string, fieldName = 'id') {
    super(`Question with ${fieldName} "${fieldValue}" not found`);
  }
}
