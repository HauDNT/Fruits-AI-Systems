import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import {Device} from "@/modules/devices/entities/device.entity";

@Entity('raspberry_config')
export class Raspberry {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    device_id: number;

    @ManyToOne(() => Device, (device) => device.id)
    @JoinColumn({ name: 'device_id' })
    device: Device;

    @Column('text')
    labels: string;

    @Column()
    raspAccessToken: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
