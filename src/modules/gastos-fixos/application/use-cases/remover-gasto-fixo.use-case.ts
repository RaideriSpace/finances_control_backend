import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GASTO_FIXO_REPOSITORY } from '../../domain/gasto-fixo.repository';
import type { IGastoFixoRepository } from '../../domain/gasto-fixo.repository';

@Injectable()
export class RemoverGastoFixoUseCase {
  constructor(
    @Inject(GASTO_FIXO_REPOSITORY)
    private readonly repository: IGastoFixoRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const removido = await this.repository.delete(id);
    if (!removido) {
      throw new NotFoundException(`Gasto fixo com ID ${id} não encontrado`);
    }
  }
}
