import {BadRequestException, HttpException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Area} from "@/modules/areas/entities/area.entity";
import {Repository} from "typeorm";
import {Device} from "@/modules/devices/entities/device.entity";
import {DeviceStatus} from "@/modules/device-status/entities/device-status.entity";
import {DeviceType} from "@/modules/device-types/entities/device-type.entity";
import {User} from "@/modules/user/entities/user.entity";
import {Employee} from "@/modules/employees/entities/employee.entity";
import {Fruit} from "@/modules/fruits/entities/fruit.entity";
import {FruitType} from "@/modules/fruit-types/entities/fruit-type.entity";
import {FruitClassification} from "@/modules/fruit-classification/entities/fruit-classification.entity";

@Injectable()
export class StatisticalService {
    constructor(
        @InjectRepository(Area)
        private areaRepository: Repository<Area>,
        @InjectRepository(Device)
        private deviceRepository: Repository<Device>,
        @InjectRepository(DeviceStatus)
        private deviceStatusRepository: Repository<DeviceStatus>,
        @InjectRepository(DeviceType)
        private deviceTypeRepository: Repository<DeviceType>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
        @InjectRepository(Fruit)
        private fruitRepository: Repository<Fruit>,
        @InjectRepository(FruitType)
        private fruitTypeRepository: Repository<FruitType>,
        @InjectRepository(FruitClassification)
        private fruitClassifyRepository: Repository<FruitClassification>,
    ) { }

    async getAmountUsers() {
        try {
            return await this.userRepository.count({
                where: {
                    deleted_at: null
                }
            })
        } catch (e) {
            console.log('Error when get amount users: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy số lượng tài khoản');
        }
    }

    async getAmountFruits() {
        try {
            return await this.fruitRepository.count({
                where: {
                    deleted_at: null
                }
            })
        } catch (e) {
            console.log('Error when get amount fruits: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy số lượng loại trái cây');
        }
    }

    async getAmountClassifyResult() {
        try {
            return await this.fruitClassifyRepository.count({
                where: {
                    deleted_at: null
                }
            })
        } catch (e) {
            console.log('Error when get amount fruit classify results: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy số lượng kết quả phân loại trái cây');
        }
    }

    async getAmountEmployees() {
        try {
            return await this.employeeRepository.count({
                where: {
                    deleted_at: null
                }
            })
        } catch (e) {
            console.log('Error when get amount employees: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy số lượng nhân viên');
        }
    }

    async getAmountFruitTypes() {
        try {
            return await this.fruitTypeRepository.count({
                where: {
                    deleted_at: null
                }
            })
        } catch (e) {
            console.log('Error when get amount fruit types: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy số lượng tình trạng trái cây');
        }
    }

    async getAmountAreas() {
        try {
            return await this.areaRepository.count({
                where: {
                    deleted_at: null
                }
            })
        } catch (e) {
            console.log('Error when get amount areas: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy số lượng khu vực phân loại');
        }
    }

    async getAmountDevices() {
        try {
            return await this.deviceRepository.count({
                where: {
                    deleted_at: null
                }
            })
        } catch (e) {
            console.log('Error when get amount devices: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy số lượng thiết bị');
        }
    }
}
