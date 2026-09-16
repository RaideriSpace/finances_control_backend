import { Inject, Injectable } from '@nestjs/common';
import { GASTO_FIXO_REPOSITORY } from '../../domain/gasto-fixo.repository';
import type { IGastoFixoRepository } from '../../domain/gasto-fixo.repository';
import { GastoFixo } from '../../domain/gasto-fixo.entity';
import { CreateGastoFixoDto } from '../dto/create-gasto-fixo.dto';

@Injectable()
export class CriarGastoFixoUseCase {
  constructor(
    @Inject(GASTO_FIXO_REPOSITORY)
    private readonly repository: IGastoFixoRepository,
  ) {}

  async execute(dto: CreateGastoFixoDto): Promise<GastoFixo> {
    return this.repository.create(dto);
  }
}
