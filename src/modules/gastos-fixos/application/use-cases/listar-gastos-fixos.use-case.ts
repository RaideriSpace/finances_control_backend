import { Inject, Injectable } from '@nestjs/common';
import { GASTO_FIXO_REPOSITORY } from '../../domain/gasto-fixo.repository';
import type { IGastoFixoRepository } from '../../domain/gasto-fixo.repository';
import { GastoFixo } from '../../domain/gasto-fixo.entity';

@Injectable()
export class ListarGastosFixosUseCase {
  constructor(
    @Inject(GASTO_FIXO_REPOSITORY)
    private readonly repository: IGastoFixoRepository,
  ) {}

  async execute(): Promise<GastoFixo[]> {
    return this.repository.findAll();
  }
}
