import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import {FruitTypesService} from './fruit-types.service';
import {CreateFruitTypeDto} from './dto/create-fruit-type.dto';
import {UpdateFruitTypeDto} from './dto/update-fruit-type.dto';
import {TableMetaData} from "@/interfaces/table";
import {FruitType} from "@/modules/fruit-types/entities/fruit-type.entity";

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
