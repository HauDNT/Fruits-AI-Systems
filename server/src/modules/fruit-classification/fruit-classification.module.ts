import { Module } from '@nestjs/common';
import { FruitClassificationService } from './fruit-classification.service';
import { FruitClassificationController } from './fruit-classification.controller';

@Module({
  controllers: [FruitClassificationController],
  providers: [FruitClassificationService],
})
export class FruitClassificationModule {}
