import {
  TransacaoAcao,
  TransacaoCartao,
  TransacaoTipo,
} from '../../transacoes/domain/transacao.constants';

export interface Recorrencia {
  id: string;
  compra: string;
  acao: TransacaoAcao;
  classificacao_1: string;
  classificacao_2: string | null;
  tipo: TransacaoTipo;
  parcelamento: number;
  parcela: number;
  local: string | null;
  /**
   * Quando ambos estão definidos, a recorrência é elegível para geração
   * automática mensal (ver application/use-cases/gerar-transacoes-recorrentes.use-case.ts).
   * Sem eles, o valor/conta variam a cada ciclo e o lançamento continua manual
   * (fluxo existente de "Contas Recorrentes" no frontend).
   */
  valorPadrao: number | null;
  cartaoPadrao: TransacaoCartao | null;
  /** Último mês (YYYY-MM-01) em que uma transação foi gerada automaticamente. */
  ultimaGeracao: string | null;
}

export type NovaRecorrencia = Omit<Recorrencia, 'id' | 'ultimaGeracao'>;
