import { Inject, Injectable } from '@nestjs/common';
import { RECORRENCIA_REPOSITORY } from '../../domain/recorrencia.repository';
import type { IRecorrenciaRepository } from '../../domain/recorrencia.repository';
import { Recorrencia } from '../../domain/recorrencia.entity';

@Injectable()
export class ListarRecorrenciasUseCase {
  constructor(
    @Inject(RECORRENCIA_REPOSITORY)
    private readonly repository: IRecorrenciaRepository,
  ) {}

  async execute(): Promise<Recorrencia[]> {
    return this.repository.findAll();
  }
}
