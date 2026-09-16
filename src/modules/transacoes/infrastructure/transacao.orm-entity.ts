import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import {
  TRANSACAO_ACOES,
  TRANSACAO_CARTOES,
  TRANSACAO_TIPOS,
} from '../domain/transacao.constants';

@Entity('transacoes')
export class TransacaoOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  compra!: string;

  @Column({ type: 'enum', enum: TRANSACAO_ACOES })
  acao!: string;

  // Substitui os antigos tipo_1 / classificacao
  @Column({ name: 'classificacao_1', type: 'text' })
  classificacao_1!: string;

  // Substitui o antigo tipo_2. Agora permite valores nulos
  @Column({ name: 'classificacao_2', type: 'text', nullable: true })
  classificacao_2!: string | null;

  @Column({ type: 'enum', enum: TRANSACAO_CARTOES })
  cartao!: string;

  // Preenchida apenas quando acao === 'transferência' (ver migration
  // AddCartaoDestinoToTransacoes).
  @Column({
    type: 'enum',
    enum: TRANSACAO_CARTOES,
    name: 'cartao_destino',
    nullable: true,
  })
  cartaoDestino!: string | null;

  @Column({ type: 'enum', enum: TRANSACAO_TIPOS })
  tipo!: string;

  @Column({ type: 'int' })
  parcelamento!: number;

  @Column({ type: 'int' })
  parcela!: number;

  // Mapeia para o 'double precision' do PostgreSQL
  @Column({ type: 'float' })
  valor!: number;

  // TypeORM/pg retornam colunas `date` como string ('YYYY-MM-DD'), não Date
  @Column({ type: 'date' })
  data_inicio!: string;

  @Column({ type: 'date' })
  data_fim!: string;

  // Novo campo que substitui estabelecimento e razao_social
  @Column({ type: 'text', nullable: true })
  local!: string | null;

  // Atenção: No seu novo SQL, data_pagamento permite nulo (diferente de antes)
  @Column({ type: 'date', name: 'data_pagamento', nullable: true })
  data_pagamento!: string | null;

  // Preenchido quando esta transação foi auto-gerada a partir de uma recorrência
  // (ver migration AddRecorrenciaIdToTransacoes).
  @Column({ type: 'uuid', name: 'recorrencia_id', nullable: true })
  recorrenciaId!: string | null;
}
