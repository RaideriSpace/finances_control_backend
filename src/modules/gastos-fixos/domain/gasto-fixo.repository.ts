import { RepositoryPort } from '../../common/repository.port';
import { GastoFixo, NovoGastoFixo } from './gasto-fixo.entity';

export const GASTO_FIXO_REPOSITORY = Symbol('GASTO_FIXO_REPOSITORY');

export interface IGastoFixoRepository extends RepositoryPort<GastoFixo> {
  create(gastoFixo: NovoGastoFixo): Promise<GastoFixo>;
  updateFields(
    id: string,
    partial: Partial<Omit<GastoFixo, 'id'>>,
  ): Promise<GastoFixo | null>;
}
