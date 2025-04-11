import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Device } from "@/modules/devices/entities/device.entity";

@Entity({ name: 'device_status' })
export class DeviceStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "nvarchar",
    length: 30
  })
  status_name: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date | null;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date | null;

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at: Date | null;

  // Device Status <-> Devices
  @OneToMany(() => Device, device => device.deviceType)
  device: Device;
}
