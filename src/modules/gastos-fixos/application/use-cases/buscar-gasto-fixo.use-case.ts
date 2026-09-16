import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GASTO_FIXO_REPOSITORY } from '../../domain/gasto-fixo.repository';
import type { IGastoFixoRepository } from '../../domain/gasto-fixo.repository';
import { GastoFixo } from '../../domain/gasto-fixo.entity';

@Injectable()
export class BuscarGastoFixoUseCase {
  constructor(
    @Inject(GASTO_FIXO_REPOSITORY)
    private readonly repository: IGastoFixoRepository,
  ) {}

  async execute(id: string): Promise<GastoFixo> {
    const gasto = await this.repository.findById(id);
    if (!gasto) {
      throw new NotFoundException(`Gasto fixo com ID ${id} não encontrado`);
    }
    return gasto;
  }
}
