import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SALDO_REPOSITORY } from '../../domain/saldo.repository';
import type { ISaldoRepository } from '../../domain/saldo.repository';
import { Saldo } from '../../domain/saldo.entity';

@Injectable()
export class BuscarSaldoUseCase {
  constructor(
    @Inject(SALDO_REPOSITORY) private readonly repository: ISaldoRepository,
  ) {}

  async execute(id: string): Promise<Saldo> {
    const saldo = await this.repository.findById(id);
    if (!saldo) {
      throw new NotFoundException(`Saldo com ID ${id} não encontrado`);
    }
    return saldo;
  }
}
