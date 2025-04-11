import { Module } from '@nestjs/common';
import { FruitsService } from './fruits.service';
import { FruitsController } from './fruits.controller';

@Module({
  controllers: [FruitsController],
  providers: [FruitsService],
})
export class FruitsModule {}
