import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SALDO_REPOSITORY } from '../../domain/saldo.repository';
import type { ISaldoRepository } from '../../domain/saldo.repository';
import { Saldo } from '../../domain/saldo.entity';
import { UpdateSaldoDto } from '../dto/update-saldo.dto';

@Injectable()
export class AtualizarSaldoUseCase {
  constructor(
    @Inject(SALDO_REPOSITORY) private readonly repository: ISaldoRepository,
  ) {}

  async execute(id: string, dto: UpdateSaldoDto): Promise<Saldo> {
    const atualizado = await this.repository.updateFields(id, dto);
    if (!atualizado) {
      throw new NotFoundException(`Saldo com ID ${id} não encontrado`);
    }
    return atualizado;
  }
}
