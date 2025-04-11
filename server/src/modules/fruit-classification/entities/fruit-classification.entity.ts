import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, ManyToOne, OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Area } from "@/modules/areas/entities/area.entity";
import { FruitBatch } from "@/modules/fruit-batches/entities/fruit-batch.entity";
import { Fruit } from "@/modules/fruits/entities/fruit.entity";
import { FruitType } from "@/modules/fruit-types/entities/fruit-type.entity";

@Entity({ name: 'fruit_classification' })
export class FruitClassification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'double' })
  confidence_level: number;

  @Column({ type: 'text' })
  image_url: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date | null;

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at: Date | null;

  // Fruit Classification <-> Fruits
  @ManyToOne(() => Fruit, fruit => fruit.fruitClassified)
  @JoinColumn({ name: 'fruit_id' })
  fruit: Fruit;

  // Fruit Classification <-> Fruit Types
  @ManyToOne(() => FruitType, type => type.fruitClassified)
  @JoinColumn({ name: 'type_id' })
  fruitType: FruitType;

  // Fruit Classification <-> Areas
  @ManyToOne(() => Area, area => area.fruitClassified)
  @JoinColumn({ name: 'area_id' })
  areaBelong: Area;

  // Fruit Classification <-> Batches
  @ManyToOne(() => FruitBatch, batch => batch.fruitClassified)
  @JoinColumn({ name: 'batch_id' })
  fruitBatchBelong: FruitBatch;

}
