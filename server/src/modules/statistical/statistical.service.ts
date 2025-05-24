import {BadRequestException, HttpException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import * as dayjs from "dayjs";
import * as isoWeek from 'dayjs/plugin/isoWeek';
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

dayjs.extend(isoWeek);

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

    async getClassifyStatisticChartByDaysOfWeek(fruitName: string) {
        try {
            const today = dayjs();
            const startOfWeek = today.startOf('week').add(1, 'day');

            const rawData = await this.fruitClassifyRepository
                .createQueryBuilder('fc')
                .select("ft.type_name", "name")
                .addSelect("f.fruit_name", "fruit")
                .addSelect("WEEKDAY(fc.created_at)", "weekday") // 0 = Monday, ..., 6 = Sunday
                .addSelect("COUNT(*)", "count")
                .innerJoin("fc.fruitType", "ft")
                .innerJoin("fc.fruit", "f")
                .where("fc.deleted_at IS NULL")
                .andWhere("f.fruit_name = :fruitName", { fruitName })
                .andWhere("fc.created_at BETWEEN :start AND :end", {
                    start: startOfWeek.toDate(),
                    end: today.toDate()
                })
                .groupBy("ft.type_name")
                .addGroupBy("WEEKDAY(fc.created_at)")
                .orderBy("WEEKDAY(fc.created_at)", "ASC")
                .addOrderBy("ft.type_name", "ASC")
                .getRawMany();

            const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
            const todayWeekday = today.day() === 0 ? 6 : today.day() - 1;

            const resultMap: Record<string, number[]> = {};

            rawData.forEach(item => {
                const name = item.name;
                const weekday = parseInt(item.weekday);
                const count = parseInt(item.count);

                if (!resultMap[name]) {
                    resultMap[name] = new Array(7).fill(0);
                }

                resultMap[name][weekday] = count;
            });

            const series = Object.entries(resultMap).map(([name, data]) => ({
                name,
                data: data.slice(0, todayWeekday + 1)
            }));
            const categories = dayNames.slice(0, todayWeekday + 1);

            return {
                series,
                categories
            };
        } catch (e) {
            console.log('Error when get data for classify statistic chart by days of week: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy dữ liệu cho biểu đồ thống kê kết quả phân loại theo ngày trong tuần');
        }
    }

    async getClassifyStatisticChartByMonth(fruitName: string) {
        try {
            const fruit = await this.fruitRepository.findOneBy({ fruit_name: fruitName });

            if (!fruit) {
                throw new BadRequestException('Tên trái cây không tồn tại');
            }

            const now = dayjs();
            const startOfMonth = now.startOf('month').toDate();
            const endOfMonth = now.endOf('day').toDate(); // đến thời điểm hiện tại

            const rawData = await this.fruitClassifyRepository
                .createQueryBuilder('fc')
                .select("ft.type_name", "name")
                .addSelect("f.fruit_name", "fruit")
                .addSelect("DAY(fc.created_at)", "day")
                .addSelect("COUNT(*)", "count")
                .innerJoin("fc.fruitType", "ft")
                .innerJoin("fc.fruit", "f")
                .where("fc.deleted_at IS NULL")
                .andWhere("f.fruit_name = :fruitName", { fruitName })
                .andWhere("fc.created_at BETWEEN :start AND :end", {
                    start: startOfMonth,
                    end: endOfMonth
                })
                .groupBy("ft.type_name")
                .addGroupBy("DAY(fc.created_at)")
                .orderBy("DAY(fc.created_at)", "ASC")
                .addOrderBy("ft.type_name", "ASC")
                .getRawMany();

            const currentDay = now.date(); // ngày hiện tại trong tháng (vd: 15)
            const resultMap: Record<string, number[]> = {};

            rawData.forEach(item => {
                const name = item.name;
                const dayIndex = parseInt(item.day) - 1;
                const count = parseInt(item.count);

                if (!resultMap[name]) {
                    resultMap[name] = new Array(currentDay).fill(0);
                }

                resultMap[name][dayIndex] = count;
            });

            const series = Object.entries(resultMap).map(([name, data]) => ({
                name,
                data
            }));

            const categories = Array.from({ length: currentDay }, (_, i) => (i + 1).toString().padStart(2, '0'));

            return {
                series,
                categories
            };
        } catch (e) {
            console.log('Error when get data for classify statistic chart by month: ', e.message);

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy dữ liệu cho biểu đồ thống kê kết quả phân loại trong tháng hiện tại');
        }
    }

    async getClassifyStatisticChartByYear(fruitName: string) {
        try {
            const fruit = await this.fruitRepository.findOneBy({ fruit_name: fruitName })

            if (!fruit) {
                throw new BadRequestException('Tên trái cây không tồn tại')
            }

            const yearStart = new Date(new Date().getFullYear(), 0, 1); // 01/01/yyyy
            const today = new Date();

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
                    start: yearStart,
                    end: today
                })
                .groupBy("ft.type_name")
                .addGroupBy("MONTH(fc.created_at)")
                .orderBy("ft.type_name")
                .addOrderBy("month", 'DESC')
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
            console.log('Error when get data for classify statistic chart by year: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy dữ liệu cho biểu đồ thống kê kết quả phân loại trong 1 năm');
        }
    }

    async getRatioOfFruits() {
        try {
            return await this.fruitClassifyRepository
                .createQueryBuilder('fc')
                .leftJoinAndSelect('fc.fruit', 'fruit')
                .select('fruit.fruit_desc', 'fruit')
                .addSelect('COUNT(*)', 'count')
                .groupBy('fruit.fruit_desc')
                .getRawMany();
        } catch (e) {
            console.log('Error when get ratio of fruits: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy tỉ lệ các loại trái cây');
        }
    }

    async getEmployeesInEachArea() {
        try {
            return await this.employeeRepository
                .createQueryBuilder('em')
                .leftJoinAndSelect('em.areaWorkAt', 'area')
                .select('area.area_desc', 'area_name')
                .addSelect('COUNT(*)', 'count')
                .groupBy('area.area_desc')
                .orderBy("area.area_desc", "ASC")
                .getRawMany();
        } catch (e) {
            console.log('Error when get amount employee in each area: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy số lượng nhân viên thuộc mỗi khu phân loại');
        }
    }

}
