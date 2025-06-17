import { Module } from '@nestjs/common';
import { FruitImagesService } from './fruit-images.service';
import { FruitImagesController } from './fruit-images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FruitImage } from '@/modules/fruit-images/entities/fruit-image.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FruitImage])],
    controllers: [FruitImagesController],
    providers: [FruitImagesService],
})
export class FruitImagesModule {}
