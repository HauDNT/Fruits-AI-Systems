import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, JoinColumn, ManyToOne, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Area} from "@/modules/areas/entities/area.entity";
import {User} from "@/modules/user/entities/user.entity";

@Entity({name: 'employees'})
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
        unique: true,
    })
    employee_code: string;

    @Column({
        type: 'nvarchar',
        length: 100
    })
    fullname: string;

    @Column({type: "integer"})
    gender: number;

    @Column({length: 11})
    phone_number: string;

    @Column({type: 'text'})
    avatar_url: string;

    @CreateDateColumn({type: "timestamp"})
    created_at: Date | null;

    @UpdateDateColumn({type: "timestamp"})
    updated_at: Date | null;

    @DeleteDateColumn({type: "timestamp"})
    deleted_at: Date | null;

    // Thêm cột area_id để TypeScript nhận diện
    @Column({ name: 'area_id', type: 'integer', nullable: true })
    area_id: number | null;

    // Employees <-> Area
    @ManyToOne(() => Area, area => area.employee)
    @JoinColumn({ name: 'area_id' })
    areaWorkAt: Area;
}
