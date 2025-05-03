import {BadRequestException, HttpException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Raspberry} from "@/modules/raspberry/entities/raspberry.entity";
import {DataSource, Repository} from "typeorm";
import {Device} from "@/modules/devices/entities/device.entity";
import {JwtService} from "@nestjs/jwt";
import {RaspberryConfigDto} from "@/modules/raspberry/dto/raspberry-config.dto";
import {FruitTypeIdsDto} from "@/modules/raspberry/dto/fruit-type-ids.dto";

@Injectable()
export class RaspberryService {
    constructor(
        @InjectRepository(Raspberry)
        private raspberryRepository: Repository<Raspberry>,
        @InjectRepository(Device)
        private deviceRepository: Repository<Device>,
        private dataSource: DataSource,
        private jwtService: JwtService,
    ) {
    }

    async getAvailableMapIds() {
        try {
            const mappings = await this.dataSource.query(
                'SELECT ftm.fruit_id, f.fruit_name, ftm.type_id, ft.type_name ' +
                'FROM fruit_types_map ftm ' +
                'JOIN fruits f ON ftm.fruit_id = f.id ' +
                'JOIN fruit_types ft ON ftm.type_id = ft.id ' +
                'WHERE f.deleted_at IS NULL ' +
                'AND ft.deleted_at IS NULL'
            )

            return mappings.map(map => ({
                fruit_id: map.fruit_id,
                type_id: map.type_id,
                label: `${map.fruit_name} ${map.type_name}`,
            }))
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy nhãn cho Raspberry');
        }
    }

    // Chuyển từ mảng JSON [{fruit_id:..., type_id:...}] thành nhãn
    async generateLabelsFromFruitAndTypeIds(ids: FruitTypeIdsDto[]) {
        try {
            if (!ids || ids.length === 0) {
                return [];
            }

            let mappings = []
            for (const map of ids) {
                const typeMap = await this.dataSource.query(
                    'SELECT ' +
                    'f.fruit_name, ' +
                    'ft.type_name ' +
                    'FROM fruit_types_map ftm ' +
                    'JOIN fruits f ON ftm.fruit_id = f.id ' +
                    'JOIN fruit_types ft ON ftm.type_id = ft.id ' +
                    `WHERE ftm.fruit_id = ${map.fruit_id} ` +
                    `AND ftm.type_id = ${map.type_id} ` +
                    'AND f.deleted_at IS NULL ' +
                    'AND ft.deleted_at IS NULL'
                )
                mappings.push(typeMap[0])
            }

            return mappings.map(mapping => `${mapping.fruit_name} ${mapping.type_name}`);
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình tạo nhãn từ trái và tình trạng cho Raspberry');
        }
    }
    
    async getRaspberryAccessToken(device_code: string) {
        try {
            const getRaspberry = await this.deviceRepository.findOneBy({device_code: device_code})
            if (!getRaspberry) {
                throw new BadRequestException(`Mã thiết bị ${device_code} không tồn tại`)
            }

            const raspberryConfig = await this.raspberryRepository.findOneBy({device: getRaspberry})
            const payload = {
                deviceId: getRaspberry.id,
                deviceCode: getRaspberry.device_code,
            }

            const accessToken = this.jwtService.sign(payload)

            raspberryConfig.raspAccessToken = accessToken
            await this.raspberryRepository.save(raspberryConfig)

            return {accessToken}
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình tạo token cho Raspberry');
        }
    }

    async getConfigByDeviceId(deviceCode: string, isParseJSON: boolean): Promise<Raspberry> {
        try {
            const raspberry = await this.deviceRepository.findOneBy({device_code: deviceCode})
            if (!raspberry) {
                throw new BadRequestException(`Mã thiết bị ${deviceCode} không tồn tại`)
            }

            const raspConfig = await this.raspberryRepository.findOneBy({device_id: raspberry.id})
            if (!raspConfig) {
                throw new BadRequestException(`Không tìm thấy cấu hình`)
            }

            const labelsArray = raspConfig.labels ? JSON.parse(raspConfig.labels) as FruitTypeIdsDto[] : [];
            if (isParseJSON === true) {
                const labels = await this.generateLabelsFromFruitAndTypeIds(labelsArray);

                console.log('Labels: ', labels)

                raspConfig.labels = JSON.stringify(labels);
            }

            return raspConfig
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy cấu hình cho Raspberry');
        }
    }

    async updateRaspberryConfig(data: RaspberryConfigDto) {
        /*
            {
                "deviceId": 8,
                "deviceCode": "#DV-JMAW5A",
                "labels": [
                    { "fruit_id": 9, "type_id": 22 },
                    { "fruit_id": 9, "type_id": 24 },
                    { "fruit_id": 10, "type_id": 22 },
                    { "fruit_id": 10, "type_id": 24 }
                ]
            }
        */
        try {
            const {deviceId, deviceCode, labels} = data
            const raspberry = await this.deviceRepository.findOneBy({id: deviceId})

            if (!raspberry) {
                throw new BadRequestException('Raspberry không tồn tại')
            }

            const accessToken = this.jwtService.sign({deviceId, deviceCode})
            const labelsString = JSON.stringify(labels);
            const configData = {
                device_id: raspberry.id,
                labels: labelsString,
                raspAccessToken: accessToken,
            }

            return await this.raspberryRepository.upsert(
                configData,
                {
                    conflictPaths: ['device_id'],
                    skipUpdateIfNoValuesChanged: true,
                }
            )
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình tạo cấu hình cho Raspberry');
        }
    }
}
