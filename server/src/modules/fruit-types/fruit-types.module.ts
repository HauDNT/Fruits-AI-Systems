import { Module } from '@nestjs/common';
import { FruitTypesService } from './fruit-types.service';
import { FruitTypesController } from './fruit-types.controller';

@Module({
  controllers: [FruitTypesController],
  providers: [FruitTypesService],
})
export class FruitTypesModule {}
