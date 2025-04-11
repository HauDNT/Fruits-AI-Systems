import { Injectable } from '@nestjs/common';
import { CreateFruitTypeDto } from './dto/create-fruit-type.dto';
import { UpdateFruitTypeDto } from './dto/update-fruit-type.dto';

@Injectable()
export class FruitTypesService {
  create(createFruitTypeDto: CreateFruitTypeDto) {
    return 'This action adds a new fruitType';
  }

  findAll() {
    return `This action returns all fruitTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fruitType`;
  }

  update(id: number, updateFruitTypeDto: UpdateFruitTypeDto) {
    return `This action updates a #${id} fruitType`;
  }

  remove(id: number) {
    return `This action removes a #${id} fruitType`;
  }
}
