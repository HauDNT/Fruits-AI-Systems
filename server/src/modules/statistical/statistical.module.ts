import {Module} from '@nestjs/common';
import {StatisticalService} from './statistical.service';
import {StatisticalController} from './statistical.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Area} from "@/modules/areas/entities/area.entity";
import {Device} from "@/modules/devices/entities/device.entity";
import {DeviceStatus} from "@/modules/device-status/entities/device-status.entity";
import {DeviceType} from "@/modules/device-types/entities/device-type.entity";
import {Employee} from "@/modules/employees/entities/employee.entity";
import {User} from "@/modules/user/entities/user.entity";
import {Fruit} from "@/modules/fruits/entities/fruit.entity";
import {FruitType} from "@/modules/fruit-types/entities/fruit-type.entity";
import {FruitClassification} from "@/modules/fruit-classification/entities/fruit-classification.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Area,
            Device,
            DeviceStatus,
            DeviceType,
            Employee,
            User,
            Fruit,
            FruitType,
            FruitClassification,
        ])
    ],
    controllers: [StatisticalController],
    providers: [StatisticalService],
})
export class StatisticalModule {
}
