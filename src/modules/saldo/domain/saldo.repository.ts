import { RepositoryPort } from '../../common/repository.port';
import { NovoSaldo, Saldo } from './saldo.entity';

export const SALDO_REPOSITORY = Symbol('SALDO_REPOSITORY');

export interface ISaldoRepository extends RepositoryPort<Saldo> {
  create(saldo: NovoSaldo): Promise<Saldo>;
  updateFields(
    id: string,
    partial: Partial<Omit<Saldo, 'id'>>,
  ): Promise<Saldo | null>;
}
