import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import {FruitBatchesService} from './fruit-batches.service';
import {CreateFruitBatchDto} from './dto/create-fruit-batch.dto';
import {UpdateFruitBatchDto} from './dto/update-fruit-batch.dto';
import {TableMetaData} from "@/interfaces/table";
import {FruitBatch} from "@/modules/fruit-batches/entities/fruit-batch.entity";

@Controller('fruit-batches')
export class FruitBatchesController {
    constructor(private readonly fruitBatchesService: FruitBatchesService) {
    }

    @Post()
    create(@Body() createFruitBatchDto: CreateFruitBatchDto) {
        return this.fruitBatchesService.create(createFruitBatchDto);
    }

    @Get('/all')
    findAll() {
        return this.fruitBatchesService.findAll();
    }

    @Get()
    async getBatchesByQuery(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('queryString') queryString: string,
        @Query('searchFields') searchFields: string,
    ): Promise<TableMetaData<FruitBatch>> {
        return await this.fruitBatchesService.getBatchesByQuery({
            page,
            limit,
            queryString,
            searchFields,
        })
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
