import { PartialType } from '@nestjs/swagger';
import { CreateFruitTypeDto } from './create-fruit-type.dto';

export class UpdateFruitTypeDto extends PartialType(CreateFruitTypeDto) {}
