import { Controller, Get, Param } from '@nestjs/common';
import { FruitImagesService } from './fruit-images.service';

@Controller('fruit-images')
export class FruitImagesController {
    constructor(private readonly fruitImagesService: FruitImagesService) { }

    @Get('/:fruit_id')
    async getFruitImages(
        @Param('fruit_id') fruit_id: string
    ): Promise<any> {
        return await this.fruitImagesService.findAllImages(Number(fruit_id));
    }
}
