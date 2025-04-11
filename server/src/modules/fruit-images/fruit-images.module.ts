import { Module } from '@nestjs/common';
import { FruitImagesService } from './fruit-images.service';
import { FruitImagesController } from './fruit-images.controller';

@Module({
  controllers: [FruitImagesController],
  providers: [FruitImagesService],
})
export class FruitImagesModule {}
