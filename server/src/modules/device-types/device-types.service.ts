import {HttpException, Injectable, BadRequestException, InternalServerErrorException} from '@nestjs/common';
import {CreateDeviceTypeDto} from './dto/create-device-type.dto';
import {UpdateDeviceTypeDto} from './dto/update-device-type.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {DeviceType} from "@/modules/device-types/entities/device-type.entity";
import {Repository} from "typeorm";

@Injectable()
export class DeviceTypesService {
    constructor(
        @InjectRepository(DeviceType)
        private deviceTypeRepository: Repository<DeviceType>
    ) {
    }

    async create(createDeviceTypeDto: CreateDeviceTypeDto) {
        try {
            const { type_name } = createDeviceTypeDto

            const existType = await this.deviceTypeRepository
                .createQueryBuilder('checkType')
                .where('LOWER(checkType.type_name) = LOWER(:type_name)', {type_name: type_name})
                .getOne()

            if (existType) {
                throw new BadRequestException('Loại thiết bị đã tồn tại')
            }

            const newDeviceType = this.deviceTypeRepository.create({
                type_name: type_name,
                created_at: new Date(),
                updated_at: new Date(),
            })

            await this.deviceTypeRepository.save(newDeviceType)

            return {
                message: 'Tạo loại thiết bị thành công',
                data: newDeviceType,
            };
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình tạo loại thiết bị');
        }
    }

    findAll() {
        return `This action returns all deviceTypes`;
    }

    findOne(id: number) {
        return `This action returns a #${id} deviceType`;
    }

    update(id: number, updateDeviceTypeDto: UpdateDeviceTypeDto) {
        return `This action updates a #${id} deviceType`;
    }

    remove(id: number) {
        return `This action removes a #${id} deviceType`;
    }
}
