import { RepositoryPort } from '../../common/repository.port';
import { NovaTransacao, Transacao } from './transacao.entity';

export const TRANSACAO_REPOSITORY = Symbol('TRANSACAO_REPOSITORY');

export interface ITransacaoRepository extends RepositoryPort<Transacao> {
  findByName(nome: string): Promise<Transacao[]>;
  createMany(transacoes: NovaTransacao[]): Promise<Transacao[]>;
  updateFields(
    id: string,
    partial: Partial<Omit<Transacao, 'id'>>,
  ): Promise<Transacao | null>;
}
