import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn, ManyToOne, JoinColumn
} from "typeorm";
import { Fruit } from "@/modules/fruits/entities/fruit.entity";

@Entity({ name: "fruit_images" })
export class FruitImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  image_url: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date | null;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date | null;

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at: Date | null;

  @ManyToOne(
    () => Fruit,
      fruit => fruit.fruitImages,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: 'fruit_id' })
  fruit: Fruit;
}
