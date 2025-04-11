import { Test, TestingModule } from '@nestjs/testing';
import { FruitTypesService } from './fruit-types.service';

describe('FruitTypesService', () => {
  let service: FruitTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FruitTypesService],
    }).compile();

    service = module.get<FruitTypesService>(FruitTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
