import { PartialType } from '@nestjs/swagger';
import { CreateFruitDto } from './create-fruit.dto';

export class UpdateFruitDto extends PartialType(CreateFruitDto) {}
