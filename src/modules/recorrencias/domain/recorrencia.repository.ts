import { RepositoryPort } from '../../common/repository.port';
import { NovaRecorrencia, Recorrencia } from './recorrencia.entity';

export const RECORRENCIA_REPOSITORY = Symbol('RECORRENCIA_REPOSITORY');

export interface IRecorrenciaRepository extends RepositoryPort<Recorrencia> {
  create(recorrencia: NovaRecorrencia): Promise<Recorrencia>;
  updateFields(
    id: string,
    partial: Partial<Omit<Recorrencia, 'id'>>,
  ): Promise<Recorrencia | null>;
}
