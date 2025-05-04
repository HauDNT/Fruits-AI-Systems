import {BadRequestException, HttpException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Raspberry} from "@/modules/raspberry/entities/raspberry.entity";
import {DataSource, Repository} from "typeorm";
import {Device} from "@/modules/devices/entities/device.entity";
import {JwtService} from "@nestjs/jwt";
import {RaspberryConfigDto} from "@/modules/raspberry/dto/raspberry-config.dto";
import {FruitTypeIdsDto} from "@/modules/raspberry/dto/fruit-type-ids.dto";
import * as dayjs from "dayjs";
import {Area} from "@/modules/areas/entities/area.entity";

@Injectable()
export class RaspberryService {
    constructor(
        @InjectRepository(Raspberry)
        private raspberryRepository: Repository<Raspberry>,
        @InjectRepository(Device)
        private deviceRepository: Repository<Device>,
        @InjectRepository(Area)
        private areaRepository: Repository<Area>,
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

    async generateLabelsFromFruitAndTypeIds(ids: FruitTypeIdsDto[]) {
        try {
            if (!ids || ids.length === 0) {
                return [];
            }

            // Truy vấn 1 lần thay vì nhiều lần
            const fruitTypeIds = ids.map(map => `(${map.fruit_id}, ${map.type_id})`).join(', ');
            const query = `
                SELECT f.fruit_name, ft.type_name
                FROM fruit_types_map ftm
                JOIN fruits f ON ftm.fruit_id = f.id
                JOIN fruit_types ft ON ftm.type_id = ft.id
                WHERE (ftm.fruit_id, ftm.type_id) IN (${fruitTypeIds})
                AND f.deleted_at IS NULL
                AND ft.deleted_at IS NULL
            `;

            // Lấy kết quả trong 1 lần
            const typeMaps = await this.dataSource.query(query);

            // Sắp xếp theo Alphabet
            const sortedMappings = typeMaps.sort((a, b) =>
                `${a.fruit_name} ${a.type_name}`.toLowerCase().localeCompare(`${b.fruit_name} ${b.type_name}`.toLowerCase())
            );

            // Trả về mảng nhãn
            return sortedMappings.map(m => `${m.fruit_name} ${m.type_name}`);
        } catch (e) {
            console.log('Lỗi: ', e.message);

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

    async getConfigByRaspCode(deviceCode: string, isRaspberry: boolean): Promise<any> {
        try {
            const raspberry = await this.deviceRepository.findOne({
                where: { device_code: deviceCode },
                relations: ['areaBelong'],
            });

            if (!raspberry) {
                throw new BadRequestException(`Mã thiết bị ${deviceCode} không tồn tại`);
            }

            const raspConfig = await this.raspberryRepository.findOneBy({ device_id: raspberry.id });
            if (!raspConfig) {
                throw new BadRequestException(`Không tìm thấy cấu hình`);
            }

            const labelsArray = raspConfig.labels ? JSON.parse(raspConfig.labels) as FruitTypeIdsDto[] : [];

            if (isRaspberry === true) {
                const area = raspberry.areaBelong;
                const formattedUpdatedAt = dayjs(raspConfig.updatedAt).format("DD/MM/YYYY HH:mm:ss");
                const labels = await this.generateLabelsFromFruitAndTypeIds(labelsArray);

                raspConfig.labels = JSON.stringify(labels);
                raspConfig.updatedAt = formattedUpdatedAt;

                return {
                    ...raspConfig,
                    areaId: area?.id ?? null,
                };
            }

            return raspConfig;
        } catch (e) {
            console.log('Lỗi: ', e.message);
            if (e instanceof HttpException) {
                throw e;
            }
            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy cấu hình cho Raspberry');
        }
    }


    async updateRaspberryConfig(data: RaspberryConfigDto) {
        try {
            const {device_id, device_code, labels} = data
            const raspberry = await this.deviceRepository.findOneBy({id: device_id})

            if (!raspberry) {
                throw new BadRequestException('Raspberry không tồn tại')
            }

            const accessToken = this.jwtService.sign({device_id: device_id, device_code: device_code})
            const labelsString = JSON.stringify(labels);
            const configData = {
                id: data.id,
                device_id: raspberry.id,
                labels: labelsString,
                raspAccessToken: accessToken,
            }

            return await this.raspberryRepository.upsert(
                configData,
                {
                    conflictPaths: ['id', 'device_id'],
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
