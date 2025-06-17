import { Controller, Get, Post, Body, Delete, Query, Param } from '@nestjs/common';
import { FruitTypesService } from './fruit-types.service';
import { CreateFruitTypeDto } from './dto/create-fruit-type.dto';
import { TableMetaData } from "@/interfaces/table";
import { FruitType } from "@/modules/fruit-types/entities/fruit-type.entity";
import { DeleteFruitTypeDto } from "@/modules/fruit-types/dto/delete-fruit-type.dto";
import { DeleteResult } from "typeorm";

@Controller('fruit-types')
export class FruitTypesController {
    constructor(private readonly fruitTypesService: FruitTypesService) {
    }

    @Get('/all')
    async getAllFruitTypes(): Promise<FruitType[]> {
        return await this.fruitTypesService.getAllFruitTypes()
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
        })
    }

    @Get('/getTypesOfFruit/:fruit_id')
    async getTypesOfFruit(
        @Param('fruit_id') fruit_id: number
    ): Promise<number[]> {
        return await this.fruitTypesService.getTypesOfFruit(fruit_id);
    }

    @Post('create-type')
    async create(@Body() createFruitTypeDto: CreateFruitTypeDto) {
        return await this.fruitTypesService.create(createFruitTypeDto);
    }

    @Delete('/delete-types')
    async deleteFruitTypes(
        @Body() data: DeleteFruitTypeDto
    ): Promise<DeleteResult | any> {
        const { fruitTypeIds } = data;
        return await this.fruitTypesService.deleteFruitTypes(fruitTypeIds);
    }
}
