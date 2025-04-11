import { Test, TestingModule } from '@nestjs/testing';
import { FruitImagesService } from './fruit-images.service';

describe('FruitImagesService', () => {
  let service: FruitImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FruitImagesService],
    }).compile();

    service = module.get<FruitImagesService>(FruitImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
