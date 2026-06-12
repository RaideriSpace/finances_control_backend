import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transacoes')
export class Transacao {
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

  // Substitui os antigos tipo_1 / classificacao
  @Column({ name: 'classificacao_1', type: 'text' })
  classificacao_1!: string;

  // Substitui o antigo tipo_2. Agora permite valores nulos
  @Column({ name: 'classificacao_2', type: 'text', nullable: true })
  classificacao_2!: string | null;

  @Column({
    type: 'enum',
    enum: [
      'picpay',
      'swile',
      'nubank',
      'inter',
      'mercado_pago',
      'amazon',
      'outro',
    ],
  })
  cartao!: string;

  @Column({ type: 'enum', enum: ['credito', 'debito'] })
  tipo!: string;

  @Column({ type: 'int' })
  parcelamento!: number;

  @Column({ type: 'int' })
  parcela!: number;

  // Mapeia para o 'double precision' do PostgreSQL
  @Column({ type: 'float' })
  valor!: number;

  @Column({ type: 'date' })
  data_inicio!: Date;

  @Column({ type: 'date' })
  data_fim!: Date;

  // Novo campo que substitui estabelecimento e razao_social
  @Column({ type: 'text', nullable: true })
  local!: string | null;

  // Atenção: No seu novo SQL, data_pagamento permite nulo (diferente de antes)
  @Column({ type: 'date', name: 'data_pagamento', nullable: true })
  data_pagamento!: string | null;
}
