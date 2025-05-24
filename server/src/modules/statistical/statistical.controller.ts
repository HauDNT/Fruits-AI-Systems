import {BadRequestException, Controller, Get, Query} from '@nestjs/common';
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

    @Get('/amount-device-types')
    async getAmountDeviceTypes() {
        return await this.statisticalService.getAmountDeviceTypes()
    }

    @Get('/classify-chart')
    async getClassifyStatisticChartByMonth(
        @Query('fruit') fruit: string,
        @Query('time_frame') time_frame: string,
    ) {
        switch (time_frame){
            case 'Tuần':
                return await this.statisticalService.getClassifyStatisticChartByDaysOfWeek(fruit)
            case 'Tháng':
                return await this.statisticalService.getClassifyStatisticChartByMonth(fruit)
            case 'Năm':
                return await this.statisticalService.getClassifyStatisticChartByYear(fruit)
            default:
                throw new BadRequestException('Khung thời gian thống kê không hợp lệ')
        }
    }

    @Get('/ratio-fruits')
    async getRatioOfFruits() {
        return await this.statisticalService.getRatioOfFruits()
    }

    @Get('/employees-each-area')
    async getEmployeesInEachArea() {
        return await this.statisticalService.getEmployeesInEachArea()
    }
}
