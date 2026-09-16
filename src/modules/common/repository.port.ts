/**
 * Contrato base que os ports de repositório de cada módulo estendem.
 * Mantém a assinatura de operações CRUD consistente sem acoplar
 * o domínio a detalhes do TypeORM.
 */
export interface RepositoryPort<TEntity, TId = string> {
  findAll(params?: { offset?: number; limit?: number }): Promise<TEntity[]>;
  findById(id: TId): Promise<TEntity | null>;
  delete(id: TId): Promise<boolean>;
}
