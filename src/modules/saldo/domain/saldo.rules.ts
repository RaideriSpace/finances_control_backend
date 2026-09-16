// Dia do mês em que cada fonte "reseta" o saldo esperado
const DIA_RESET_POR_FONTE: Record<string, number> = {
  swile: 25,
  proa: 20,
  uliving: 5,
};
const DIA_RESET_PADRAO = 1;

export const SALDOS_PADRAO_MENSAL = [
  { fonte: 'swile', valor: 1388.14 },
  { fonte: 'uliving', valor: 3500 },
] as const;

/** Clampa o saldo a um piso de zero — regra única, antes triplicada entre create/update/normalize. */
export function clampSaldo(valor: number | null | undefined): number {
  return Math.max(0, valor ?? 0);
}

export function primeiroDiaDoMes(referencia = new Date()): string {
  return `${referencia.getFullYear()}-${String(referencia.getMonth() + 1).padStart(2, '0')}-01`;
}

/**
 * Retorna o primeiro dia do mês de referência vigente para uma fonte,
 * no formato YYYY-MM-DD, com base na data de hoje.
 *
 * Ex: se hoje é 2026-06-22 e o reset da fonte é dia 25,
 * o mês de referência ainda é 2026-06 (só reseta em 25/06).
 * Se hoje é 2026-06-26, o mês de referência já é 2026-07.
 */
export function calcularMesReferencia(
  fonte: string,
  referencia: Date = new Date(),
): string {
  const diaReset = DIA_RESET_POR_FONTE[fonte] ?? DIA_RESET_PADRAO;

  let ano = referencia.getFullYear();
  let mes = referencia.getMonth(); // 0-indexed

  if (referencia.getDate() >= diaReset) {
    mes += 1;
    if (mes > 11) {
      mes = 0;
      ano += 1;
    }
  }

  const mesFormatado = String(mes + 1).padStart(2, '0');
  return `${ano}-${mesFormatado}-01`;
}
