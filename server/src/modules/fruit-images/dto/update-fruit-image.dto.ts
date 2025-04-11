import { PartialType } from '@nestjs/swagger';
import { CreateFruitImageDto } from './create-fruit-image.dto';

export class UpdateFruitImageDto extends PartialType(CreateFruitImageDto) {}
