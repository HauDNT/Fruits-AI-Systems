import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Device } from "@/modules/devices/entities/device.entity";

@Entity({ name: 'device_types' })
export class DeviceType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  type_name: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date | null;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date | null;

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at: Date | null;

  // Device Types <-> Devices
  @OneToMany(() => Device, device => device.deviceType)
  device: Device;
}
