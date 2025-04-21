import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {FruitsService} from './fruits.service';
import {CreateFruitDto} from './dto/create-fruit.dto';
import {UpdateFruitDto} from './dto/update-fruit.dto';

@Controller('fruits')
export class FruitsController {
    constructor(
        private readonly fruitsService: FruitsService) {
    }

    @Post('create-fruit')
    async create(@Body() createFruitDto: CreateFruitDto) {
        return await this.fruitsService.create(createFruitDto);
    }

    @Get('/all')
    async findAll() {
        return await this.fruitsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.fruitsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFruitDto: UpdateFruitDto) {
        return this.fruitsService.update(+id, updateFruitDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.fruitsService.remove(+id);
    }
}
