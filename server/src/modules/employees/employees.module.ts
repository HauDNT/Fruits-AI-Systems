import {Module} from '@nestjs/common';
import {EmployeesService} from './employees.service';
import {EmployeesController} from './employees.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Employee} from "@/modules/employees/entities/employee.entity";
import {Area} from "@/modules/areas/entities/area.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Area, Employee]),
    ],
    controllers: [EmployeesController],
    providers: [EmployeesService],
})
export class EmployeesModule {
}
