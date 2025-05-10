import {BadRequestException, HttpException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import * as dayjs from "dayjs";
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

    async getAmountDeviceTypes() {
        try {
            return await this.deviceTypeRepository.count({
                where: {
                    deleted_at: null
                }
            })
        } catch (e) {
            console.log('Error when get amount device types: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy số lượng loại thiết bị');
        }
    }

    async getClassifyStatisticChartByMonth(fruitName: string) {
        try {
            const fruit = await this.fruitRepository.findOneBy({ fruit_name: fruitName })

            if (!fruit) {
                throw new BadRequestException('Tên trái cây không tồn tại')
            }

            const today = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 6);

            const rawData = await this.fruitClassifyRepository
                .createQueryBuilder('fc')
                .select("ft.type_name", "name")
                .addSelect("f.fruit_name", "fruit")
                .addSelect("MONTH(fc.created_at)", "month")
                .addSelect("COUNT(*)", "count")
                .innerJoin("fc.fruitType", "ft")
                .innerJoin("fc.fruit", "f")
                .where("fc.deleted_at IS NULL")
                .andWhere("f.fruit_name = :fruitName", { fruitName })
                .andWhere("fc.created_at BETWEEN :start AND :end", {
                    start: sevenDaysAgo,
                    end: today
                })
                .groupBy("ft.type_name")
                .addGroupBy("MONTH(fc.created_at)")
                .orderBy("ft.type_name")
                .addOrderBy("month")
                .getRawMany();

            const resultMap: Record<string, number[]> = {};
            const monthSet = new Set<number>();

            rawData.forEach(item => {
                const name = item.name;
                const monthIndex = parseInt(item.month) - 1;
                const count = parseInt(item.count);

                if (!resultMap[name]) {
                    resultMap[name] = new Array(12).fill(0);
                }

                resultMap[name][monthIndex] = count;
                monthSet.add(monthIndex);
            });

            const series = Object.entries(resultMap).map(([name, data]) => ({
                name,
                data
            }));

            const categories = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

            return {
                series,
                categories
            };
        } catch (e) {
            console.log('Error when get data for classify statistic chart by month: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy dữ liệu cho biểu đồ thống kê kết quả phân loại theo tháng');
        }
    }

    async getClassifyStatisticChartByDaysOfWeek(fruitName: string) {
        try {
            const dateSet = new Set<string>();
            const rawData = await this.fruitClassifyRepository
                .createQueryBuilder('fc')
                .select("ft.type_name", "name")
                .addSelect("f.fruit_name", "fruit")
                .addSelect("DATE(fc.created_at)", "date")
                .addSelect("COUNT(*)", "count")
                .innerJoin("fc.fruitType", "ft")
                .innerJoin("fc.fruit", "f")
                .where("fc.deleted_at IS NULL")
                .andWhere("f.fruit_name = :fruitName", { fruitName })
                .groupBy("ft.type_name")
                .addGroupBy("DATE(fc.created_at)")
                .orderBy("ft.type_name")
                .addOrderBy("date")
                .getRawMany();

            const resultMap: Record<string, Record<string, number>> = {};
            rawData.forEach(item => {
                const name = item.name;
                const date = item.date;
                const count = parseInt(item.count);

                dateSet.add(date);

                if (!resultMap[name]) {
                    resultMap[name] = {};
                }

                resultMap[name][date] = count;
            });

            const allDates = Array.from(dateSet).sort();
            const formatDates = allDates.map(dateStr => dayjs(dateStr).format("DD/MM/YYYY HH:mm:ss"))
            const series = Object.entries(resultMap).map(([name, dateMap]) => {
                const data = allDates.map(date => dateMap[date] || 0);
                return { name, data };
            });

            return {
                series,
                categories: formatDates,
            };
        } catch (e) {
            console.log('Error when get data for classify statistic chart by days of week: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy dữ liệu cho biểu đồ thống kê kết quả phân loại theo ngày trong tuần');
        }
    }
}
