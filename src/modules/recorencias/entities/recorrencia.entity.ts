import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('recorrencias')
export class Recorrencia {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  compra!: string;

  @Column({
    type: 'enum',
    enum: [
      'pagamento',
      'transferência',
      'depósito',
      'investimento',
      'saque',
      'compra',
    ],
  })
  acao!: string;

  @Column({ name: 'classificacao_1', type: 'text' })
  classificacao_1!: string;

  @Column({ name: 'classificacao_2', type: 'text', nullable: true })
  classificacao_2!: string | null;

  @Column({ type: 'enum', enum: ['credito', 'debito'] })
  tipo!: string;

  @Column({ type: 'int' })
  parcelamento!: number;

  @Column({ type: 'int' })
  parcela!: number;

  @Column({ type: 'text', nullable: true })
  local!: string | null;
}
