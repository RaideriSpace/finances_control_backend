import {
  TransacaoAcao,
  TransacaoCartao,
  TransacaoTipo,
} from './transacao.constants';

/**
 * Entidade de domínio — não conhece TypeORM, HTTP ou Swagger.
 */
export interface Transacao {
  id: string;
  compra: string;
  acao: TransacaoAcao;
  classificacao_1: string;
  classificacao_2: string | null;
  cartao: TransacaoCartao;
  /** Conta de destino — só usada quando `acao === 'transferência'`. */
  cartaoDestino: TransacaoCartao | null;
  tipo: TransacaoTipo;
  parcelamento: number;
  parcela: number;
  valor: number;
  data_inicio: string;
  data_fim: string;
  local: string | null;
  data_pagamento: string | null;
  /** Preenchido quando a transação foi gerada automaticamente por uma recorrência. */
  recorrenciaId: string | null;
}

export type NovaTransacao = Omit<Transacao, 'id'>;
