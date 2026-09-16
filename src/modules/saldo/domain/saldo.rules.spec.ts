import { calcularMesReferencia, clampSaldo } from './saldo.rules';

describe('clampSaldo', () => {
  it('não permite saldo negativo', () => {
    expect(clampSaldo(-10)).toBe(0);
    expect(clampSaldo(10)).toBe(10);
    expect(clampSaldo(null)).toBe(0);
    expect(clampSaldo(undefined)).toBe(0);
  });
});

describe('calcularMesReferencia', () => {
  it('mantém o mês de referência antes do dia de reset da fonte', () => {
    expect(calcularMesReferencia('swile', new Date(2026, 5, 22))).toBe(
      '2026-06-01',
    );
  });

  it('avança o mês de referência a partir do dia de reset da fonte', () => {
    expect(calcularMesReferencia('swile', new Date(2026, 5, 26))).toBe(
      '2026-07-01',
    );
  });

  it('vira o ano quando o reset cai em dezembro', () => {
    expect(calcularMesReferencia('swile', new Date(2026, 11, 26))).toBe(
      '2027-01-01',
    );
  });

  it('usa o dia 1 como reset padrão para fontes desconhecidas', () => {
    expect(calcularMesReferencia('desconhecida', new Date(2026, 5, 2))).toBe(
      '2026-07-01',
    );
  });
});
