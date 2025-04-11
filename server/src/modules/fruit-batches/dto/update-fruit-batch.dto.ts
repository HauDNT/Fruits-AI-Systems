import { PartialType } from '@nestjs/swagger';
import { CreateFruitBatchDto } from './create-fruit-batch.dto';

export class UpdateFruitBatchDto extends PartialType(CreateFruitBatchDto) {}
