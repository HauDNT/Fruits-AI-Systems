import { Test, TestingModule } from '@nestjs/testing';
import { FruitImagesController } from './fruit-images.controller';
import { FruitImagesService } from './fruit-images.service';

describe('FruitImagesController', () => {
  let controller: FruitImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FruitImagesController],
      providers: [FruitImagesService],
    }).compile();

    controller = module.get<FruitImagesController>(FruitImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
