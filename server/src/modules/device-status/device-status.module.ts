import {Module} from '@nestjs/common';
import {DeviceStatusService} from './device-status.service';
import {DeviceStatusController} from './device-status.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {DeviceStatus} from "@/modules/device-status/entities/device-status.entity";
import {Device} from "@/modules/devices/entities/device.entity";

@Module({
    imports: [TypeOrmModule.forFeature([DeviceStatus, Device])],
    controllers: [DeviceStatusController],
    providers: [DeviceStatusService],
})
export class DeviceStatusModule {
}
