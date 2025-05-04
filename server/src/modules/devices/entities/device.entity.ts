import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn, Unique,
    UpdateDateColumn
} from "typeorm";
import {DeviceType} from "@/modules/device-types/entities/device-type.entity";
import {DeviceStatus} from "@/modules/device-status/entities/device-status.entity";
import {Area} from "@/modules/areas/entities/area.entity";

@Entity({name: 'devices'})
export class Device {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 100,
        unique: true,
    })
    device_code: string;

    @Column({type: "text"})
    image_url: string;

    @CreateDateColumn({type: "timestamp"})
    created_at: Date | null;

    @UpdateDateColumn({type: "timestamp"})
    updated_at: Date | null;

    @DeleteDateColumn({type: "timestamp"})
    deleted_at: Date | null;

    // Devices <-> Device Type
    @ManyToOne(() => DeviceType, type => type.device)
    @JoinColumn({name: 'type_id'})
    deviceType: DeviceType;

    // Devices <-> Device Status
    @ManyToOne(() => DeviceStatus, status => status.device)
    @JoinColumn({name: 'status_id'})
    deviceStatus: DeviceStatus;

    // Devices <-> Batches
    @ManyToOne(() => Area, area => area.devices)
    @JoinColumn({name: 'area_id'})
    areaBelong: Area;
}
