import { Injectable } from '@nestjs/common';
import { CreateFruitBatchDto } from './dto/create-fruit-batch.dto';
import { UpdateFruitBatchDto } from './dto/update-fruit-batch.dto';

@Injectable()
export class FruitBatchesService {
  create(createFruitBatchDto: CreateFruitBatchDto) {
    return 'This action adds a new fruitBatch';
  }

  findAll() {
    return `This action returns all fruitBatches`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fruitBatch`;
  }

  update(id: number, updateFruitBatchDto: UpdateFruitBatchDto) {
    return `This action updates a #${id} fruitBatch`;
  }

  remove(id: number) {
    return `This action removes a #${id} fruitBatch`;
  }
}
