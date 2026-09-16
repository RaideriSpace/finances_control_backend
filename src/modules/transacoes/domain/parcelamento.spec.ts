import { calcularParcelas } from './parcelamento';

describe('calcularParcelas', () => {
  it('mantém débito como uma única parcela na data inicial', () => {
    expect(calcularParcelas('debito', 12, '2026-04-20')).toEqual({
      dataInicio: '2026-04-20',
      dataFim: '2026-04-20',
      parcelas: [{ parcela: 1, dataPagamento: '2026-04-20' }],
    });
  });

  it('calcula parcelas de crédito no dia 5 dos meses seguintes', () => {
    expect(calcularParcelas('credito', 3, '2026-04-20')).toEqual({
      dataInicio: '2026-04-20',
      dataFim: '2026-06-05',
      parcelas: [
        { parcela: 1, dataPagamento: '2026-04-20' },
        { parcela: 2, dataPagamento: '2026-05-05' },
        { parcela: 3, dataPagamento: '2026-06-05' },
      ],
    });
  });
});
