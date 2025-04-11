import { Injectable } from '@nestjs/common';
import { CreateFruitClassificationDto } from './dto/create-fruit-classification.dto';
import { UpdateFruitClassificationDto } from './dto/update-fruit-classification.dto';

@Injectable()
export class FruitClassificationService {
  create(createFruitClassificationDto: CreateFruitClassificationDto) {
    return 'This action adds a new fruitClassification';
  }

  findAll() {
    return `This action returns all fruitClassification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fruitClassification`;
  }

  update(id: number, updateFruitClassificationDto: UpdateFruitClassificationDto) {
    return `This action updates a #${id} fruitClassification`;
  }

  remove(id: number) {
    return `This action removes a #${id} fruitClassification`;
  }
}
