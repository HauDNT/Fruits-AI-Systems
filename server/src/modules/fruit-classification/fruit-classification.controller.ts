import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FruitClassificationService } from './fruit-classification.service';
import { CreateFruitClassificationDto } from './dto/create-fruit-classification.dto';
import { UpdateFruitClassificationDto } from './dto/update-fruit-classification.dto';

@Controller('fruit-classification')
export class FruitClassificationController {
  constructor(private readonly fruitClassificationService: FruitClassificationService) {}

  @Post()
  create(@Body() createFruitClassificationDto: CreateFruitClassificationDto) {
    return this.fruitClassificationService.create(createFruitClassificationDto);
  }

  @Get()
  findAll() {
    return this.fruitClassificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fruitClassificationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFruitClassificationDto: UpdateFruitClassificationDto) {
    return this.fruitClassificationService.update(+id, updateFruitClassificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fruitClassificationService.remove(+id);
  }
}
