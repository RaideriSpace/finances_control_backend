import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transacoes')
export class Transacao {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  compra!: string;

  @Column() 
  estabelecimento!: string;

  @Column({ name: 'razao_social' })
  razao_social!: string;

  @Column({
    type: 'enum',
    enum: ['pagamento', 'transferência', 'depósito', 'investimento', 'saque', 'compra'],
  })
  acao!: string;

  @Column({ name: 'tipo_1' }) // Mapeia o snake_case do banco
  tipo_1!: string;

  @Column({ name: 'tipo_2', nullable: true, default: null })
  tipo_2!: string;

  @Column()
  classificacao!: string;

  @Column({
    type: 'enum',
    enum: ['picpay', 'swile', 'nubank', 'inter', 'mercado_pago', 'amazon', 'outro'],
  })
  cartao!: string;

  @Column({ type: 'enum', enum: ['credito', 'debito'] })
  tipo!: string;

  @Column('int')
  parcelamento!: number;

  @Column('int')
  parcela!: number;

  @Column('float')
  valor!: number;

  @Column({ type: 'date' })
  data_inicio!: Date;

  @Column({ type: 'date' }) 
  data_pagamento!: string;

  @Column({ type: 'date' })
  data_fim!: Date;
}
