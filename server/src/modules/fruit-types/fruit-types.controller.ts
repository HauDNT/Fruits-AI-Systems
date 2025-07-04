import { Controller, Get, Post, Body, Delete, Query, Param, Put, UseGuards } from '@nestjs/common';
import { FruitTypesService } from './fruit-types.service';
import { CreateFruitTypeDto } from './dto/create-fruit-type.dto';
import { TableMetaData } from '@/interfaces/table';
import { FruitType } from '@/modules/fruit-types/entities/fruit-type.entity';
import { DeleteFruitTypeDto } from '@/modules/fruit-types/dto/delete-fruit-type.dto';
import { DeleteResult } from 'typeorm';
import { UpdateFruitTypeDto } from '@/modules/fruit-types/dto/update-fruit-type.dto';
import { JWTGuard } from '@/authentication/jwt/jwt-guard';

@Controller('fruit-types')
@UseGuards(JWTGuard)
export class FruitTypesController {
  constructor(private readonly fruitTypesService: FruitTypesService) {}

  @Get('/all')
  async getAllFruitTypes(): Promise<FruitType[]> {
    return await this.fruitTypesService.getAllFruitTypes();
  }

  @Get()
  async getFruitTypesByQuery(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('queryString') queryString: string,
    @Query('searchFields') searchFields: string,
  ): Promise<TableMetaData<FruitType>> {
    return await this.fruitTypesService.getFruitTypesByQuery({
      page,
      limit,
      queryString,
      searchFields,
    });
  }

  @Get('/getTypesOfFruit/:fruit_id')
  async getTypesOfFruit(@Param('fruit_id') fruit_id: number): Promise<number[]> {
    return await this.fruitTypesService.getTypesOfFruit(fruit_id);
  }

  @Post('create')
  async create(@Body() createFruitTypeDto: CreateFruitTypeDto) {
    return await this.fruitTypesService.create(createFruitTypeDto);
  }

  @Put('/update/:type_id')
  async updateFruitType(
    @Param('type_id') type_id: number,
    @Body() data: UpdateFruitTypeDto,
  ): Promise<FruitType> {
    return await this.fruitTypesService.updateFruitType(type_id, data);
  }

  @Delete('/delete')
  async deleteFruitTypes(@Body() data: DeleteFruitTypeDto): Promise<DeleteResult | any> {
    const { fruitTypeIds } = data;
    return await this.fruitTypesService.deleteFruitTypes(fruitTypeIds);
  }
}
