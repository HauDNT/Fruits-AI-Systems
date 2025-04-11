import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, ManyToMany, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Fruit } from "@/modules/fruits/entities/fruit.entity";
import { FruitClassification } from "@/modules/fruit-classification/entities/fruit-classification.entity";

@Entity({ name: "fruit_types" })
export class FruitType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "nvarchar",
    length: 100
  })
  type_name: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date | null;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date | null;

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at: Date | null;

  // Fruit Types <-> Fruits
  @ManyToMany(() => Fruit, fruit => fruit.fruitTypes)
  fruits: Fruit;

  // Fruit Types <-> Fruit Classification
  @OneToMany(() => FruitClassification, classify => classify.fruitType)
  fruitClassified: FruitClassification;
}
