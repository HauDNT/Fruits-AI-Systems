import { Test, TestingModule } from '@nestjs/testing';
import { FruitTypesController } from './fruit-types.controller';
import { FruitTypesService } from './fruit-types.service';

describe('FruitTypesController', () => {
  let controller: FruitTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FruitTypesController],
      providers: [FruitTypesService],
    }).compile();

    controller = module.get<FruitTypesController>(FruitTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
