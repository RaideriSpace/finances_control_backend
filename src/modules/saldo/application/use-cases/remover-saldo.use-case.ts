import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SALDO_REPOSITORY } from '../../domain/saldo.repository';
import type { ISaldoRepository } from '../../domain/saldo.repository';

@Injectable()
export class RemoverSaldoUseCase {
  constructor(
    @Inject(SALDO_REPOSITORY) private readonly repository: ISaldoRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const removido = await this.repository.delete(id);
    if (!removido) {
      throw new NotFoundException(`Saldo com ID ${id} não encontrado`);
    }
  }
}
