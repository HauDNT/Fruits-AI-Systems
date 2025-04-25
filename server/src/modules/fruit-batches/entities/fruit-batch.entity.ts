import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {FruitClassification} from "@/modules/fruit-classification/entities/fruit-classification.entity";

@Entity('fruit_batches')
export class FruitBatch {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
        unique: true,
    })
    batch_code: string;

    @Column({type: "text"})
    batch_desc: string;

    @Column({type: "integer"})
    real_quantity: number;

    @Column({type: "integer"})
    classify_quantity: number;

    @CreateDateColumn({type: "timestamp"})
    created_at: Date | null;

    @UpdateDateColumn({type: "timestamp"})
    updated_at: Date | null;

    @DeleteDateColumn({type: "timestamp"})
    deleted_at: Date | null;

    // Batches <-> Fruit Classification
    @OneToMany(() => FruitClassification, batch => batch.fruitBatchBelong)
    fruitClassified: FruitClassification;
}
