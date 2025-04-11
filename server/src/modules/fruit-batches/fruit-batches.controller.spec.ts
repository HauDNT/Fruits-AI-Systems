import { Test, TestingModule } from '@nestjs/testing';
import { FruitBatchesController } from './fruit-batches.controller';
import { FruitBatchesService } from './fruit-batches.service';

describe('FruitBatchesController', () => {
  let controller: FruitBatchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FruitBatchesController],
      providers: [FruitBatchesService],
    }).compile();

    controller = module.get<FruitBatchesController>(FruitBatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
