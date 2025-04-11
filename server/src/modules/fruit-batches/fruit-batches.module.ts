import { Module } from '@nestjs/common';
import { FruitBatchesService } from './fruit-batches.service';
import { FruitBatchesController } from './fruit-batches.controller';

@Module({
  controllers: [FruitBatchesController],
  providers: [FruitBatchesService],
})
export class FruitBatchesModule {}
