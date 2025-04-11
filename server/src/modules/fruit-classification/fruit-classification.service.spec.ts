import { Test, TestingModule } from '@nestjs/testing';
import { FruitClassificationService } from './fruit-classification.service';

describe('FruitClassificationService', () => {
  let service: FruitClassificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FruitClassificationService],
    }).compile();

    service = module.get<FruitClassificationService>(FruitClassificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
