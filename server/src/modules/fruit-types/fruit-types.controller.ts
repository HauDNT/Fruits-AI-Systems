import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FruitTypesService } from './fruit-types.service';
import { CreateFruitTypeDto } from './dto/create-fruit-type.dto';
import { UpdateFruitTypeDto } from './dto/update-fruit-type.dto';

@Controller('fruit-types')
export class FruitTypesController {
  constructor(private readonly fruitTypesService: FruitTypesService) {}

  @Post()
  create(@Body() createFruitTypeDto: CreateFruitTypeDto) {
    return this.fruitTypesService.create(createFruitTypeDto);
  }

  @Get()
  findAll() {
    return this.fruitTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fruitTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFruitTypeDto: UpdateFruitTypeDto) {
    return this.fruitTypesService.update(+id, updateFruitTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fruitTypesService.remove(+id);
  }
}
