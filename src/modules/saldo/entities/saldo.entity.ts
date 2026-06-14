import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('saldo')
export class Saldo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  fonte!: string;

  @Column({ type: 'float', nullable: true })
  valor!: number | null;

  @Column({ type: 'date', nullable: true })
  mes!: string | null;
}
