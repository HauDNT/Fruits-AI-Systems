import {Module} from '@nestjs/common';
import {DeviceTypesService} from './device-types.service';
import {DeviceTypesController} from './device-types.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {DeviceType} from "@/modules/device-types/entities/device-type.entity";
import {Device} from "@/modules/devices/entities/device.entity";

@Module({
    imports: [TypeOrmModule.forFeature([DeviceType, Device])],
    controllers: [DeviceTypesController],
    providers: [DeviceTypesService],
})
export class DeviceTypesModule {
}
