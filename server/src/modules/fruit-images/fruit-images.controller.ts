import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { FruitImagesService } from './fruit-images.service';
import { JWTGuard } from '@/authentication/jwt/jwt-guard';

@Controller('fruit-images')
@UseGuards(JWTGuard)
export class FruitImagesController {
  constructor(private readonly fruitImagesService: FruitImagesService) {}

  @Get('/:fruit_id')
  async getFruitImages(@Param('fruit_id') fruit_id: string): Promise<any> {
    return await this.fruitImagesService.findAllImages(Number(fruit_id));
  }
}
