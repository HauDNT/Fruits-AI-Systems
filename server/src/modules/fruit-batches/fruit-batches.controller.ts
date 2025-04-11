import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FruitBatchesService } from './fruit-batches.service';
import { CreateFruitBatchDto } from './dto/create-fruit-batch.dto';
import { UpdateFruitBatchDto } from './dto/update-fruit-batch.dto';

@Controller('fruit-batches')
export class FruitBatchesController {
  constructor(private readonly fruitBatchesService: FruitBatchesService) {}

  @Post()
  create(@Body() createFruitBatchDto: CreateFruitBatchDto) {
    return this.fruitBatchesService.create(createFruitBatchDto);
  }

  @Get()
  findAll() {
    return this.fruitBatchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fruitBatchesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFruitBatchDto: UpdateFruitBatchDto) {
    return this.fruitBatchesService.update(+id, updateFruitBatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fruitBatchesService.remove(+id);
  }
}
