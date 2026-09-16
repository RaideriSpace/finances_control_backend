import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import {
  TRANSACAO_ACOES,
  TRANSACAO_CARTOES,
  TRANSACAO_TIPOS,
} from '../../transacoes/domain/transacao.constants';

@Entity('recorrencias')
export class RecorrenciaOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  compra!: string;

  @Column({ type: 'enum', enum: TRANSACAO_ACOES })
  acao!: string;

  @Column({ name: 'classificacao_1', type: 'text' })
  classificacao_1!: string;

  @Column({ name: 'classificacao_2', type: 'text', nullable: true })
  classificacao_2!: string | null;

  @Column({ type: 'enum', enum: TRANSACAO_TIPOS })
  tipo!: string;

  @Column({ type: 'int' })
  parcelamento!: number;

  @Column({ type: 'int' })
  parcela!: number;

  @Column({ type: 'text', nullable: true })
  local!: string | null;

  // Novas colunas (migration AddGeracaoAutomaticaToRecorrencias) — opcionais:
  // sem elas a recorrência continua exigindo lançamento manual do valor/conta.
  @Column({ name: 'valor_padrao', type: 'float', nullable: true })
  valorPadrao!: number | null;

  @Column({
    name: 'cartao_padrao',
    type: 'enum',
    enum: TRANSACAO_CARTOES,
    nullable: true,
  })
  cartaoPadrao!: string | null;

  @Column({ name: 'ultima_geracao', type: 'date', nullable: true })
  ultimaGeracao!: string | null;
}
