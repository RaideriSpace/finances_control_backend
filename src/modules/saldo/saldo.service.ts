import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Saldo } from './entities/saldo.entity';
import { CreateSaldoDto } from './dto/create-saldo.dto';
import { UpdateSaldoDto } from './dto/update-saldo.dto';

// Dia do mês em que cada fonte "reseta" o saldo esperado
const DIA_RESET_POR_FONTE: Record<string, number> = {
  swile: 25,
  proa: 20,
  uliving: 5,
};
const DIA_RESET_PADRAO = 1;

/**
 * Retorna o primeiro dia do mês de referência vigente para uma fonte,
 * no formato YYYY-MM-DD, com base na data de hoje.
 *
 * Ex: se hoje é 2026-06-22 e o reset da fonte é dia 25,
 * o mês de referência ainda é 2026-06 (só reseta em 25/06).
 * Se hoje é 2026-06-26, o mês de referência já é 2026-07.
 */
export function calcularMesReferencia(
  fonte: string,
  referencia: Date = new Date(),
): string {
  const diaReset = DIA_RESET_POR_FONTE[fonte] ?? DIA_RESET_PADRAO;

  let ano = referencia.getFullYear();
  let mes = referencia.getMonth(); // 0-indexed

  if (referencia.getDate() >= diaReset) {
    mes += 1;
    if (mes > 11) {
      mes = 0;
      ano += 1;
    }
  }

  const mesFormatado = String(mes + 1).padStart(2, '0');
  return `${ano}-${mesFormatado}-01`;
}

@Injectable()
export class SaldoService {
  constructor(
    @InjectRepository(Saldo)
    private readonly repository: Repository<Saldo>,
  ) {}

  async findAll(): Promise<Saldo[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<Saldo> {
    const saldo = await this.repository.findOneBy({ id });

    if (!saldo) {
      throw new NotFoundException(`Saldo com ID ${id} não encontrado`);
    }

    return saldo;
  }

  /**
   * Retorna os registros de saldo cujo mês de referência
   * corresponde ao ciclo vigente de cada fonte.
   */
  async findAtual(): Promise<Saldo[]> {
    const todos = await this.repository.find();

    return todos.filter((s) => {
      if (!s.mes) return false;
      return s.mes.startsWith(calcularMesReferencia(s.fonte).slice(0, 7));
    });
  }

  async create(dto: CreateSaldoDto): Promise<Saldo> {
    const saldo = this.repository.create(dto);
    return await this.repository.save(saldo);
  }

  async update(id: string, dto: UpdateSaldoDto): Promise<Saldo> {
    const saldo = await this.repository.preload({ id, ...dto });

    if (!saldo) {
      throw new NotFoundException(`Saldo com ID ${id} não encontrado`);
    }

    return await this.repository.save(saldo);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Saldo com ID ${id} não encontrado`);
    }
  }
}
