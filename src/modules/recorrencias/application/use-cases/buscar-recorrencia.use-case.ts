import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RECORRENCIA_REPOSITORY } from '../../domain/recorrencia.repository';
import type { IRecorrenciaRepository } from '../../domain/recorrencia.repository';
import { Recorrencia } from '../../domain/recorrencia.entity';

@Injectable()
export class BuscarRecorrenciaUseCase {
  constructor(
    @Inject(RECORRENCIA_REPOSITORY)
    private readonly repository: IRecorrenciaRepository,
  ) {}

  async execute(id: string): Promise<Recorrencia> {
    const recorrencia = await this.repository.findById(id);
    if (!recorrencia) {
      throw new NotFoundException(`Recorrência com ID ${id} não encontrada`);
    }
    return recorrencia;
  }
}
