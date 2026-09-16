import { Inject, Injectable } from '@nestjs/common';
import { TRANSACAO_REPOSITORY } from '../../domain/transacao.repository';
import type { ITransacaoRepository } from '../../domain/transacao.repository';
import { Transacao } from '../../domain/transacao.entity';

@Injectable()
export class ListarTransacoesUseCase {
  constructor(
    @Inject(TRANSACAO_REPOSITORY)
    private readonly repository: ITransacaoRepository,
  ) {}

  async execute(params?: {
    offset?: number;
    limit?: number;
  }): Promise<Transacao[]> {
    return this.repository.findAll(params);
  }
}
