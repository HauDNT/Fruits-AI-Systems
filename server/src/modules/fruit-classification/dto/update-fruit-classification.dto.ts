import { PartialType } from '@nestjs/swagger';
import { CreateFruitClassificationDto } from './create-fruit-classification.dto';

export class UpdateFruitClassificationDto extends PartialType(CreateFruitClassificationDto) {}
