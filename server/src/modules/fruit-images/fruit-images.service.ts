import { Injectable } from '@nestjs/common';
import { CreateFruitImageDto } from './dto/create-fruit-image.dto';
import { UpdateFruitImageDto } from './dto/update-fruit-image.dto';

@Injectable()
export class FruitImagesService {
  create(createFruitImageDto: CreateFruitImageDto) {
    return 'This action adds a new fruitImage';
  }

  findAll() {
    return `This action returns all fruitImages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fruitImage`;
  }

  update(id: number, updateFruitImageDto: UpdateFruitImageDto) {
    return `This action updates a #${id} fruitImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} fruitImage`;
  }
}
