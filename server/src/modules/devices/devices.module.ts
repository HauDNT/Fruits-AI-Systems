import {Module} from '@nestjs/common';
import {DevicesService} from './devices.service';
import {DevicesController} from './devices.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Device} from "@/modules/devices/entities/device.entity";
import {DeviceType} from "@/modules/device-types/entities/device-type.entity";
import {DeviceStatus} from "@/modules/device-status/entities/device-status.entity";
import {Area} from "@/modules/areas/entities/area.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Device, DeviceType, DeviceStatus, Area])],
    controllers: [DevicesController],
    providers: [DevicesService],
})
export class DevicesModule {
}
