import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RECORRENCIA_REPOSITORY } from '../../domain/recorrencia.repository';
import type { IRecorrenciaRepository } from '../../domain/recorrencia.repository';

@Injectable()
export class RemoverRecorrenciaUseCase {
  constructor(
    @Inject(RECORRENCIA_REPOSITORY)
    private readonly repository: IRecorrenciaRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const removida = await this.repository.delete(id);
    if (!removida) {
      throw new NotFoundException(`Recorrência com ID ${id} não encontrada`);
    }
  }
}
