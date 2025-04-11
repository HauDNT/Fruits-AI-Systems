import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinTable,
  ManyToMany, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { FruitType } from "@/modules/fruit-types/entities/fruit-type.entity";
import { FruitImage } from "@/modules/fruit-images/entities/fruit-image.entity";
import { FruitClassification } from "@/modules/fruit-classification/entities/fruit-classification.entity";

@Entity({ name: "fruits" })
export class Fruit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "nvarchar",
    length: 100
  })
  fruit_name: string;

  @Column({ type: "text" })
  fruit_des: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date | null;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date | null;

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at: Date | null;

  // Fruits <-> Fruit Types
  @ManyToMany(() => FruitType, fruitType => fruitType.fruits)
  @JoinTable({
    name: 'fruit_types_map',
    joinColumn: {
      name: 'fruit_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'type_id',
      referencedColumnName: 'id',
    }
  })
  fruitTypes: FruitType[]

  // Fruits <-> Fruit Images
  @OneToMany(() => FruitImage, image => image.fruit, { cascade: true})
  images: FruitImage[];

  // Fruits <-> Fruit Classification
  @OneToMany(() => FruitClassification, classify => classify.fruit)
  fruitClassified: FruitClassification;
}
