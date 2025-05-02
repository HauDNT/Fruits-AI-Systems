import { Test, TestingModule } from '@nestjs/testing';
import { RaspberryService } from './raspberry.service';

describe('RaspberryService', () => {
  let service: RaspberryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RaspberryService],
    }).compile();

    service = module.get<RaspberryService>(RaspberryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
