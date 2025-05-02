import {BadRequestException, HttpException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Raspberry} from "@/modules/raspberry/entities/raspberry.entity";
import {Repository} from "typeorm";
import {Device} from "@/modules/devices/entities/device.entity";
import {JwtService} from "@nestjs/jwt";
import {RaspberryConfigDto} from "@/modules/raspberry/dto/raspberry-config.dto";

@Injectable()
export class RaspberryService {
    constructor(
        @InjectRepository(Raspberry)
        private raspberryRepository: Repository<Raspberry>,
        @InjectRepository(Device)
        private deviceRepository: Repository<Device>,
        private jwtService: JwtService,
    ) {
    }

    async getRaspberryAccessToken(device_code: string) {
        try {
            const getRaspberry = await this.deviceRepository.findOneBy({ device_code: device_code})
            if (!getRaspberry) {
                throw new BadRequestException(`Mã thiết bị ${device_code} không tồn tại`)
            }

            const raspberryConfig = await this.raspberryRepository.findOneBy({ device: getRaspberry })
            const payload = {
                deviceId: getRaspberry.id,
                deviceCode: getRaspberry.device_code,
            }

            const accessToken = this.jwtService.sign(payload)

            raspberryConfig.raspAccessToken = accessToken
            await this.raspberryRepository.save(raspberryConfig)

            return { accessToken }
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình tạo token cho Raspberry');
        }
    }

    async getConfigByDeviceId(deviceCode: string): Promise<Raspberry> {
        try {
            const raspberry = await this.deviceRepository.findOneBy({ device_code: deviceCode })
            if (!raspberry) {
                throw new BadRequestException(`Mã thiết bị ${deviceCode} không tồn tại`)
            }

            const raspConfig = await this.raspberryRepository.findOneBy({device: raspberry })
            if (!raspConfig) {
                throw new BadRequestException(`Không tìm thấy cấu hình`)
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
        try {
            const { deviceId, deviceCode, labels } = data
            const raspberry = await this.deviceRepository.findOneBy({ id: deviceId })

            if (!raspberry) {
                throw new BadRequestException('Raspberry không tồn tại')
            }

            const accessToken = this.jwtService.sign({ deviceId, deviceCode })
            const configData = {
                device_id: raspberry.id,
                labels,
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
