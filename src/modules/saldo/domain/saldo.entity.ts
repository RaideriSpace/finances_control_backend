export interface Saldo {
  id: string;
  fonte: string;
  valor: number;
  mes: string | null;
}

export type NovoSaldo = Omit<Saldo, 'id'>;
