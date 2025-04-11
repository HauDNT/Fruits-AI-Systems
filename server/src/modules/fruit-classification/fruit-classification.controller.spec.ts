import { Test, TestingModule } from '@nestjs/testing';
import { FruitClassificationController } from './fruit-classification.controller';
import { FruitClassificationService } from './fruit-classification.service';

describe('FruitClassificationController', () => {
  let controller: FruitClassificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FruitClassificationController],
      providers: [FruitClassificationService],
    }).compile();

    controller = module.get<FruitClassificationController>(FruitClassificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
