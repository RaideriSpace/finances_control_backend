export interface GastoFixo {
  id: string;
  nome: string;
  valor: number;
}

export type NovoGastoFixo = Omit<GastoFixo, 'id'>;
