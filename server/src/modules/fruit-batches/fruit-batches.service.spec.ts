import { Test, TestingModule } from '@nestjs/testing';
import { FruitBatchesService } from './fruit-batches.service';

describe('FruitBatchesService', () => {
  let service: FruitBatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FruitBatchesService],
    }).compile();

    service = module.get<FruitBatchesService>(FruitBatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
