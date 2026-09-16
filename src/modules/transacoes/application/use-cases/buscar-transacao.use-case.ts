import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TRANSACAO_REPOSITORY } from '../../domain/transacao.repository';
import type { ITransacaoRepository } from '../../domain/transacao.repository';
import { Transacao } from '../../domain/transacao.entity';

@Injectable()
export class BuscarTransacaoUseCase {
  constructor(
    @Inject(TRANSACAO_REPOSITORY)
    private readonly repository: ITransacaoRepository,
  ) {}

  async porId(id: string): Promise<Transacao> {
    const transacao = await this.repository.findById(id);
    if (!transacao) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada`);
    }
    return transacao;
  }

  async porNome(nome: string): Promise<Transacao[]> {
    return this.repository.findByName(nome);
  }
}
