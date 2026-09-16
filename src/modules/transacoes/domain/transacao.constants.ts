export const TRANSACAO_ACOES = [
  'pagamento',
  'transferência',
  'depósito',
  'investimento',
  'saque',
  'compra',
] as const;

export const TRANSACAO_CARTOES = [
  'picpay',
  'swile',
  'nubank',
  'inter',
  'mercado_pago',
  'amazon',
  'outro',
] as const;

export const TRANSACAO_TIPOS = ['credito', 'debito'] as const;

export type TransacaoAcao = (typeof TRANSACAO_ACOES)[number];
export type TransacaoCartao = (typeof TRANSACAO_CARTOES)[number];
export type TransacaoTipo = (typeof TRANSACAO_TIPOS)[number];

/**
 * Categorização canônica de ações em entrada/saída de caixa.
 * Fonte única usada por transacoes, dashboard e (via lib/finance) pelo frontend —
 * antes disso existiam duas cópias divergentes (transacoes vs dashboard).
 */
export const TRANSACAO_ACOES_ENTRADA: readonly TransacaoAcao[] = [
  'depósito',
  'investimento',
];

// 'transferência' representa só a perna de saída da conta de origem — a
// perna de entrada é um 'depósito' de verdade criado na conta de destino
// (ver CriarTransacaoUseCase), então aqui ela é uma saída como qualquer
// outra; o total da carteira já fica neutro por ter as duas linhas reais.
export const TRANSACAO_ACOES_SAIDA: readonly TransacaoAcao[] = [
  'pagamento',
  'saque',
  'transferência',
  'compra',
];
