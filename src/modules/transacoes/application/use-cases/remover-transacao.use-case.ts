import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TRANSACAO_REPOSITORY } from '../../domain/transacao.repository';
import type { ITransacaoRepository } from '../../domain/transacao.repository';

@Injectable()
export class RemoverTransacaoUseCase {
  constructor(
    @Inject(TRANSACAO_REPOSITORY)
    private readonly repository: ITransacaoRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const removida = await this.repository.delete(id);
    if (!removida) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada`);
    }
  }
}
