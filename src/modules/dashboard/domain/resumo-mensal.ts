import { Transacao } from '../../transacoes/domain/transacao.entity';
import {
  TRANSACAO_ACOES_ENTRADA,
  TRANSACAO_ACOES_SAIDA,
} from '../../transacoes/domain/transacao.constants';

export interface CategoriaResumo {
  nome: string;
  valor: number;
}

export interface ResumoMensal {
  mes: string;
  disponivel: number;
  devido: number;
  totalGasto: number;
  categorias: CategoriaResumo[];
  ultimosLancamentos: Transacao[];
}

function dataDaTransacao(transacao: Transacao): string {
  return String(transacao.data_pagamento ?? transacao.data_inicio).slice(0, 10);
}

/** Data de hoje em "YYYY-MM-DD", em horário local (evita o deslocamento de
 * `toISOString()`, que usa UTC). */
function hojeFormatado(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

// Categorias auto-preenchidas pelo frontend para transferência e pagamento
// de fatura (ver FormularioTransacao) — são movimentação de dinheiro entre
// contas, não "gasto" no sentido de categoria de despesa, então não aparecem
// no top de categorias do dashboard.
const CATEGORIAS_OCULTAS_DO_RESUMO = new Set(['Transferência', 'Cartão']);

/**
 * Regra pura de agregação do dashboard. Reusa a categorização canônica de
 * entrada/saída de `transacoes/domain/transacao.constants.ts` — antes desta
 * limpeza, o dashboard mantinha sua própria cópia (`ACOES_SAIDA`/
 * `ACOES_ENTRADA_DEBITO`) que já tinha divergido da fonte original.
 *
 * `disponivel` (saldo apurado a partir do razão de transações de débito) é um
 * conceito diferente do saldo do módulo `saldo` (renda esperada por fonte,
 * com dia de reset por fonte) — não são a mesma métrica renomeada.
 */
export function calcularResumoMensal(
  transacoes: Transacao[],
  mes: string,
): ResumoMensal {
  const transacoesMes = transacoes.filter((transacao) =>
    dataDaTransacao(transacao).startsWith(mes),
  );
  const gastos = transacoesMes.filter(
    (transacao) =>
      TRANSACAO_ACOES_SAIDA.includes(transacao.acao) &&
      !CATEGORIAS_OCULTAS_DO_RESUMO.has(transacao.classificacao_1),
  );

  const categorias = new Map<string, number>();
  for (const transacao of gastos) {
    const categoria = transacao.classificacao_1 || 'Sem categoria';
    categorias.set(
      categoria,
      (categorias.get(categoria) ?? 0) + transacao.valor,
    );
  }

  // Transferência já é duas linhas reais (saída na origem + depósito no
  // destino, ambas tipo débito — ver CriarTransacaoUseCase), então soma e
  // subtração comuns já resultam em efeito neutro no total, sem caso especial.
  const disponivel = transacoes
    .filter((transacao) => transacao.tipo === 'debito')
    .reduce(
      (total, transacao) =>
        total +
        (TRANSACAO_ACOES_ENTRADA.includes(transacao.acao)
          ? Math.max(0, transacao.valor)
          : -Math.max(0, transacao.valor)),
      0,
    );

  // Devido é a soma de todo lançamento em crédito até hoje (inclusive) —
  // parcelas com vencimento futuro ainda não entram na fatura em aberto —
  // abatendo o que for "depósito" ou "pagamento" (pagamento de fatura;
  // "pagamento" em crédito só existe em dados legados de antes do fluxo de
  // duas linhas, mas continua abatendo aqui). Mantido igual a
  // calcularFaturasPorConta no frontend, que soma por conta com a mesma
  // regra — os dois precisam bater.
  const hoje = hojeFormatado();
  const devido = transacoes
    .filter(
      (transacao) =>
        transacao.tipo === 'credito' && dataDaTransacao(transacao) <= hoje,
    )
    .reduce((total, transacao) => {
      if (transacao.acao === 'depósito' || transacao.acao === 'pagamento') {
        return total - transacao.valor;
      }
      return total + transacao.valor;
    }, 0);

  const totalGasto = transacoesMes.reduce(
    (total, transacao) =>
      total +
      (transacao.acao === 'depósito' ? transacao.valor : -transacao.valor),
    0,
  );

  return {
    mes,
    disponivel: Math.max(0, disponivel),
    devido: Math.max(0, devido),
    totalGasto,
    categorias: [...categorias.entries()]
      .map(([nome, valor]) => ({ nome, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5),
    ultimosLancamentos: [...transacoesMes]
      .sort((a, b) => dataDaTransacao(b).localeCompare(dataDaTransacao(a)))
      .slice(0, 10),
  };
}
