import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('gastos_fixos')
export class GastoFixo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  nome!: string;

  @Column({ type: 'real' })
  valor!: number;
}
