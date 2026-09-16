import { TransacaoTipo } from './transacao.constants';

export interface ParcelaCalculada {
  parcela: number;
  dataPagamento: string;
}

function parseData(data: Date | string): Date {
  const valor = data instanceof Date ? data.toISOString().slice(0, 10) : data;
  const [ano, mes, dia] = valor.slice(0, 10).split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

function formatarData(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

/**
 * Recalcula a data de pagamento de uma única parcela (índice 0 = primeira),
 * usando a mesma fórmula de `calcularParcelas`. Reusada pelo use-case de
 * atualização para não dessincronizar a regra quando `data_inicio` muda.
 */
export function calcularDataPagamentoParcela(
  dataInicio: Date | string,
  indice: number,
): string {
  if (indice === 0) {
    return formatarData(parseData(dataInicio));
  }
  const pagamento = parseData(dataInicio);
  pagamento.setMonth(pagamento.getMonth() + indice);
  pagamento.setDate(5);
  return formatarData(pagamento);
}

export function calcularParcelas(
  tipo: TransacaoTipo,
  parcelamento: number,
  dataInicio: Date | string,
): { dataInicio: string; dataFim: string; parcelas: ParcelaCalculada[] } {
  const inicio = parseData(dataInicio);
  const dataInicioFormatada = formatarData(inicio);
  const totalParcelas = tipo === 'debito' ? 1 : parcelamento;
  const fim = parseData(dataInicio);
  fim.setMonth(fim.getMonth() + totalParcelas - 1);
  fim.setDate(totalParcelas > 1 ? 5 : inicio.getDate());

  const parcelas = Array.from({ length: totalParcelas }, (_, indice) => {
    if (indice === 0) {
      return { parcela: 1, dataPagamento: dataInicioFormatada };
    }

    const pagamento = parseData(dataInicio);
    pagamento.setMonth(pagamento.getMonth() + indice);
    pagamento.setDate(5);
    return { parcela: indice + 1, dataPagamento: formatarData(pagamento) };
  });

  return {
    dataInicio: dataInicioFormatada,
    dataFim: formatarData(fim),
    parcelas,
  };
}
