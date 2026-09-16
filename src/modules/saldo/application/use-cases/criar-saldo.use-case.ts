import { Inject, Injectable } from '@nestjs/common';
import { SALDO_REPOSITORY } from '../../domain/saldo.repository';
import type { ISaldoRepository } from '../../domain/saldo.repository';
import { Saldo } from '../../domain/saldo.entity';
import { calcularMesReferencia, clampSaldo } from '../../domain/saldo.rules';
import { CreateSaldoDto } from '../dto/create-saldo.dto';

@Injectable()
export class CriarSaldoUseCase {
  constructor(
    @Inject(SALDO_REPOSITORY) private readonly repository: ISaldoRepository,
  ) {}

  async execute(dto: CreateSaldoDto): Promise<Saldo> {
    return this.repository.create({
      fonte: dto.fonte,
      valor: clampSaldo(dto.valor),
      // Se o mês não vier explícito, usa o ciclo vigente da fonte
      // (antes disso só o frontend calculava isso, duplicado).
      mes: dto.mes ?? calcularMesReferencia(dto.fonte),
    });
  }
}
