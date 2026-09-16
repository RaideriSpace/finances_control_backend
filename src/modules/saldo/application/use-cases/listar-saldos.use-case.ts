import { Inject, Injectable } from '@nestjs/common';
import { SALDO_REPOSITORY } from '../../domain/saldo.repository';
import type { ISaldoRepository } from '../../domain/saldo.repository';
import { Saldo } from '../../domain/saldo.entity';

@Injectable()
export class ListarSaldosUseCase {
  constructor(
    @Inject(SALDO_REPOSITORY) private readonly repository: ISaldoRepository,
  ) {}

  async execute(): Promise<Saldo[]> {
    return this.repository.findAll();
  }
}
