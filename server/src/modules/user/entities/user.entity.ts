import { RefreshToken } from '@/modules/refresh-token/refresh-token.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date | null;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date | null;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date | null;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];
}
