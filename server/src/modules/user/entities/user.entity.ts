import {Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    username: string;

    @Column()
    password: string;

    @CreateDateColumn({type: "timestamp"})
    created_at: Date | null;

    @UpdateDateColumn({type: "timestamp"})
    updated_at: Date | null;

    @DeleteDateColumn({type: "timestamp"})
    deleted_at: Date | null;
}
