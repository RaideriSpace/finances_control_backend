import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GASTO_FIXO_REPOSITORY } from '../../domain/gasto-fixo.repository';
import type { IGastoFixoRepository } from '../../domain/gasto-fixo.repository';
import { GastoFixo } from '../../domain/gasto-fixo.entity';
import { UpdateGastoFixoDto } from '../dto/update-gasto-fixo.dto';

@Injectable()
export class AtualizarGastoFixoUseCase {
  constructor(
    @Inject(GASTO_FIXO_REPOSITORY)
    private readonly repository: IGastoFixoRepository,
  ) {}

  async execute(id: string, dto: UpdateGastoFixoDto): Promise<GastoFixo> {
    const atualizado = await this.repository.updateFields(id, dto);
    if (!atualizado) {
      throw new NotFoundException(`Gasto fixo com ID ${id} não encontrado`);
    }
    return atualizado;
  }
}
