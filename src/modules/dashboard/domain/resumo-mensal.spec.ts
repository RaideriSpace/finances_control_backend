import { calcularResumoMensal } from './resumo-mensal';
import { Transacao } from '../../transacoes/domain/transacao.entity';

function transacao(overrides: Partial<Transacao>): Transacao {
  return {
    id: 'id',
    compra: 'compra',
    acao: 'compra',
    classificacao_1: 'Casa',
    classificacao_2: null,
    cartao: 'nubank',
    cartaoDestino: null,
    tipo: 'debito',
    parcelamento: 1,
    parcela: 1,
    valor: 0,
    data_inicio: '2026-09-01',
    data_fim: '2026-09-01',
    local: null,
    data_pagamento: '2026-09-01',
    recorrenciaId: null,
    ...overrides,
  };
}

// O "devido" é calculado em cima da data real do sistema (hoje), não do
// parâmetro `mes` — datas fixas em "2026-09" ficariam frágeis se o relógio
// real avançar, então os testes de devido usam datas relativas a `new Date()`.
function formatarData(data: Date): string {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
}
const hoje = new Date();
const ontem = formatarData(
  new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 1),
);
const amanha = formatarData(
  new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1),
);
const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;

describe('calcularResumoMensal', () => {
  it('calcula disponível, devido e total gasto pelo tipo e pela ação', () => {
    const transacoes: Transacao[] = [
      transacao({
        tipo: 'debito',
        valor: 100,
        acao: 'compra',
        data_pagamento: '2026-09-02',
        classificacao_1: 'Casa',
      }),
      transacao({
        tipo: 'debito',
        valor: 50,
        acao: 'depósito',
        data_pagamento: '2026-09-03',
        classificacao_1: 'Entrada',
      }),
      transacao({
        tipo: 'credito',
        valor: 80,
        acao: 'compra',
        data_pagamento: ontem,
        classificacao_1: 'Casa',
      }),
      transacao({
        tipo: 'credito',
        valor: 20,
        acao: 'investimento',
        data_pagamento: ontem,
        classificacao_1: 'Investimentos',
      }),
      transacao({
        tipo: 'debito',
        valor: 75,
        acao: 'investimento',
        data_pagamento: '2026-09-06',
        classificacao_1: 'Investimentos',
      }),
      transacao({
        tipo: 'debito',
        valor: 250,
        acao: 'depósito',
        data_pagamento: '2026-08-31',
        classificacao_1: 'Entrada',
      }),
      transacao({
        tipo: 'debito',
        valor: 50,
        acao: 'compra',
        data_pagamento: '2026-08-30',
        classificacao_1: 'Fora do mês',
      }),
    ];

    const resumo = calcularResumoMensal(transacoes, '2026-09');

    expect(resumo.disponivel).toBe(225);
    // Devido soma todo lançamento em crédito até hoje — "compra" (80) e
    // "investimento" (20) contam igual, só "depósito"/"pagamento" abatem.
    expect(resumo.devido).toBe(100);
    expect(resumo.totalGasto).toBe(-225);
  });

  it('devido não soma faturas com vencimento futuro (só até hoje, inclusive)', () => {
    const transacoes: Transacao[] = [
      transacao({
        tipo: 'credito',
        valor: 100,
        acao: 'compra',
        parcelamento: 3,
        parcela: 1,
        data_pagamento: ontem,
      }),
      transacao({
        tipo: 'credito',
        valor: 100,
        acao: 'compra',
        parcelamento: 3,
        parcela: 2,
        data_pagamento: amanha,
      }),
    ];

    const resumo = calcularResumoMensal(transacoes, mesAtual);

    expect(resumo.devido).toBe(100);
  });

  it('transferência (saída na origem + depósito no destino) é neutra no total, por ser duas linhas reais', () => {
    const transacoes: Transacao[] = [
      transacao({
        tipo: 'debito',
        valor: 300,
        acao: 'depósito',
        data_pagamento: '2026-09-02',
      }),
      // As duas pernas que CriarTransacaoUseCase gera para uma transferência:
      transacao({
        tipo: 'debito',
        valor: 100,
        acao: 'transferência',
        cartao: 'nubank',
        cartaoDestino: 'inter',
        local: 'Para inter',
        data_pagamento: '2026-09-03',
      }),
      transacao({
        tipo: 'debito',
        valor: 100,
        acao: 'depósito',
        cartao: 'inter',
        local: 'De nubank',
        data_pagamento: '2026-09-03',
      }),
    ];

    const resumo = calcularResumoMensal(transacoes, '2026-09');

    // 300 (depósito) - 100 (saída da transferência) + 100 (entrada da transferência) = 300
    expect(resumo.disponivel).toBe(300);
    expect(resumo.totalGasto).toBe(300);
  });

  it('pagamento de fatura (saída débito na origem + depósito crédito no destino) reduz o valor devido', () => {
    const transacoes: Transacao[] = [
      transacao({
        tipo: 'credito',
        valor: 500,
        acao: 'compra',
        data_pagamento: ontem,
      }),
      // As duas pernas que CriarTransacaoUseCase gera para um pagamento de fatura:
      transacao({
        tipo: 'debito',
        valor: 200,
        acao: 'pagamento',
        cartao: 'inter',
        cartaoDestino: 'nubank',
        local: 'Para nubank',
        data_pagamento: ontem,
      }),
      transacao({
        tipo: 'credito',
        valor: 200,
        acao: 'depósito',
        cartao: 'nubank',
        local: 'De inter',
        data_pagamento: ontem,
      }),
    ];

    const resumo = calcularResumoMensal(transacoes, mesAtual);

    // 500 (compra) - 200 (pagamento) = 300 ainda devido
    expect(resumo.devido).toBe(300);
  });

  it('devido é acumulado entre meses, não zera ao pagar hoje uma compra antiga', () => {
    const mesPassado = formatarData(
      new Date(hoje.getFullYear(), hoje.getMonth() - 1, 15),
    );

    const transacoes: Transacao[] = [
      // Compra feita no mês passado, ainda não paga.
      transacao({
        tipo: 'credito',
        valor: 500,
        acao: 'compra',
        data_pagamento: mesPassado,
      }),
      // Pagamento da fatura antiga, feito hoje.
      transacao({
        tipo: 'debito',
        valor: 500,
        acao: 'pagamento',
        cartao: 'inter',
        cartaoDestino: 'nubank',
        local: 'Para nubank',
        data_pagamento: ontem,
      }),
      transacao({
        tipo: 'credito',
        valor: 500,
        acao: 'depósito',
        cartao: 'nubank',
        local: 'De inter',
        data_pagamento: ontem,
      }),
      // Nova compra recente, ainda não paga.
      transacao({
        tipo: 'credito',
        valor: 120,
        acao: 'compra',
        cartao: 'nubank',
        data_pagamento: ontem,
      }),
    ];

    const resumo = calcularResumoMensal(transacoes, mesAtual);

    // 500 (compra antiga) - 500 (pagamento) + 120 (compra nova) = 120 devido
    expect(resumo.devido).toBe(120);
  });

  it('não mostra "Transferência" nem "Cartão" no top de categorias', () => {
    const transacoes: Transacao[] = [
      transacao({
        tipo: 'debito',
        valor: 100,
        acao: 'transferência',
        classificacao_1: 'Transferência',
        cartaoDestino: 'inter',
        data_pagamento: '2026-09-05',
      }),
      transacao({
        tipo: 'debito',
        valor: 200,
        acao: 'pagamento',
        classificacao_1: 'Cartão',
        cartaoDestino: 'nubank',
        data_pagamento: '2026-09-06',
      }),
      transacao({
        tipo: 'debito',
        valor: 50,
        acao: 'compra',
        classificacao_1: 'Mercado',
        data_pagamento: '2026-09-07',
      }),
    ];

    const resumo = calcularResumoMensal(transacoes, '2026-09');

    expect(resumo.categorias).toEqual([{ nome: 'Mercado', valor: 50 }]);
  });
});
