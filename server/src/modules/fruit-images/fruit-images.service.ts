import { Injectable, NotFoundException } from '@nestjs/common';
import { FruitImage } from '@/modules/fruit-images/entities/fruit-image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { omitFields } from '@/utils/omitFields';

@Injectable()
export class FruitImagesService {
    constructor(
        @InjectRepository(FruitImage)
        private readonly fruitImageRepository: Repository<FruitImage>,
    ) { }

    async findAllImages(fruit_id: number) {
        const fruitImages = await this.fruitImageRepository.find({
            where: { fruit: { id: fruit_id } }
        });

        if (fruitImages.length === 0) {
            throw new NotFoundException('Không tìm thấy ảnh của trái cây này');
        };

        const images = fruitImages.map(image =>
            omitFields(image, ['created_at', 'updated_at', 'deleted_at'])
        );

        return images;
    }

}
