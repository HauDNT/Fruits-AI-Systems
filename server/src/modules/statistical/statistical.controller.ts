import {Controller, Get} from '@nestjs/common';
import {StatisticalService} from './statistical.service';

@Controller('statistical')
export class StatisticalController {
    constructor(private readonly statisticalService: StatisticalService) {
    }

    @Get('/amount-users')
    async getAmountUsers() {
        return await this.statisticalService.getAmountUsers()
    }

    @Get('/amount-fruits')
    async getAmountFruits() {
        return await this.statisticalService.getAmountFruits()
    }

    @Get('/amount-classify-result')
    async getAmountClassifyResult() {
        return await this.statisticalService.getAmountClassifyResult()
    }

    @Get('/amount-employees')
    async getAmountEmployees() {
        return await this.statisticalService.getAmountEmployees()
    }

    @Get('/amount-fruit-types')
    async getAmountFruitTypes() {
        return await this.statisticalService.getAmountFruitTypes()
    }

    @Get('/amount-areas')
    async getAmountAreas() {
        return await this.statisticalService.getAmountAreas()
    }

    @Get('/amount-devices')
    async getAmountDevices() {
        return await this.statisticalService.getAmountDevices()
    }
}
