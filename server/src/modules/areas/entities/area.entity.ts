import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Device} from "@/modules/devices/entities/device.entity";
import {Employee} from "@/modules/employees/entities/employee.entity";
import {FruitClassification} from "@/modules/fruit-classification/entities/fruit-classification.entity";

@Entity({name: 'areas'})
export class Area {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
        unique: true,
    })
    area_code: string;

    @Column({length: 100})
    area_desc: string;

    @Column({type: "text"})
    image_url: string;

    @CreateDateColumn({type: "timestamp"})
    created_at: Date | null;

    @UpdateDateColumn({type: "timestamp"})
    updated_at: Date | null;

    @DeleteDateColumn({type: "timestamp"})
    deleted_at: Date | null;

    // Area <-> Devices
    @OneToMany(() => Device, device => device.areaBelong)
    devices: Device[];

    // Area <-> Employees
    @OneToMany(() => Employee, employee => employee.areaWorkAt)
    employee: Employee;

    // Area <-> Fruit Classification
    @OneToMany(() => FruitClassification, classify => classify.areaBelong)
    fruitClassified: FruitClassification;
}
