import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISaldoRepository } from '../domain/saldo.repository';
import { NovoSaldo, Saldo } from '../domain/saldo.entity';
import { clampSaldo } from '../domain/saldo.rules';
import { SaldoOrmEntity } from './saldo.orm-entity';
import { SaldoMapper } from './saldo.mapper';

@Injectable()
export class SaldoTypeOrmRepository implements ISaldoRepository {
  constructor(
    @InjectRepository(SaldoOrmEntity)
    private readonly repository: Repository<SaldoOrmEntity>,
  ) {}

  async findAll(params?: {
    offset?: number;
    limit?: number;
  }): Promise<Saldo[]> {
    const rows = await this.repository.find({
      skip: params?.offset,
      take: params?.limit,
    });
    return rows.map((row) => SaldoMapper.toDomain(row));
  }

  async findById(id: string): Promise<Saldo | null> {
    const row = await this.repository.findOneBy({ id });
    return row ? SaldoMapper.toDomain(row) : null;
  }

  async create(saldo: NovoSaldo): Promise<Saldo> {
    const entity = this.repository.create({
      ...SaldoMapper.toPersistence(saldo),
      valor: clampSaldo(saldo.valor),
    });
    const saved = await this.repository.save(entity);
    return SaldoMapper.toDomain(saved);
  }

  async updateFields(
    id: string,
    partial: Partial<Omit<Saldo, 'id'>>,
  ): Promise<Saldo | null> {
    const preloaded = await this.repository.preload({
      id,
      ...partial,
      ...(partial.valor === undefined
        ? {}
        : { valor: clampSaldo(partial.valor) }),
    });
    if (!preloaded) return null;
    const saved = await this.repository.save(preloaded);
    return SaldoMapper.toDomain(saved);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
