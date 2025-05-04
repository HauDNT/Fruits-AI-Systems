import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {Area} from "@/modules/areas/entities/area.entity";
import {Fruit} from "@/modules/fruits/entities/fruit.entity";
import {FruitType} from "@/modules/fruit-types/entities/fruit-type.entity";

@Entity({name: 'fruit_classification'})
export class FruitClassification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'double', nullable: true})
    confidence_level: number;

    @Column({type: 'text'})
    image_url: string;

    @CreateDateColumn({type: "timestamp"})
    created_at: Date | null;

    @DeleteDateColumn({type: "timestamp"})
    deleted_at: Date | null;

    // Fruit Classification <-> Fruits
    @ManyToOne(() => Fruit, fruit => fruit.fruitClassified)
    @JoinColumn({name: 'fruit_id'})
    fruit: Fruit;

    // Fruit Classification <-> Fruit Types
    @ManyToOne(() => FruitType, type => type.fruitClassified)
    @JoinColumn({name: 'type_id'})
    fruitType: FruitType;

    // Fruit Classification <-> Batches
    @ManyToOne(() => Area, area => area.fruitClassified)
    @JoinColumn({name: 'area_id'})
    areaBelong: Area;
}
