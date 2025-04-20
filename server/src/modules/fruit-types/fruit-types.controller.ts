import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import {FruitTypesService} from './fruit-types.service';
import {CreateFruitTypeDto} from './dto/create-fruit-type.dto';
import {TableMetaData} from "@/interfaces/table";
import {FruitType} from "@/modules/fruit-types/entities/fruit-type.entity";
import {DeleteFruitTypeDto} from "@/modules/fruit-types/dto/delete-fruit-type.dto";
import {DeleteResult} from "typeorm";

@Controller('fruit-types')
export class FruitTypesController {
    constructor(private readonly fruitTypesService: FruitTypesService) {
    }

    @Post('create-type')
    async create(@Body() createFruitTypeDto: CreateFruitTypeDto) {
        return await this.fruitTypesService.create(createFruitTypeDto);
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

    @Delete('/delete-types')
    async remove(
        @Body() data: DeleteFruitTypeDto
    ): Promise<DeleteResult | any> {
        const { fruitTypeIds } = data;
        return  await this.fruitTypesService.deleteFruitTypes(fruitTypeIds);
    }
}
