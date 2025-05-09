import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
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




    
}
