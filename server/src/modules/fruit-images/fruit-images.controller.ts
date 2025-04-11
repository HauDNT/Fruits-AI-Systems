import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FruitImagesService } from './fruit-images.service';
import { CreateFruitImageDto } from './dto/create-fruit-image.dto';
import { UpdateFruitImageDto } from './dto/update-fruit-image.dto';

@Controller('fruit-images')
export class FruitImagesController {
  constructor(private readonly fruitImagesService: FruitImagesService) {}

  @Post()
  create(@Body() createFruitImageDto: CreateFruitImageDto) {
    return this.fruitImagesService.create(createFruitImageDto);
  }

  @Get()
  findAll() {
    return this.fruitImagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fruitImagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFruitImageDto: UpdateFruitImageDto) {
    return this.fruitImagesService.update(+id, updateFruitImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fruitImagesService.remove(+id);
  }
}
