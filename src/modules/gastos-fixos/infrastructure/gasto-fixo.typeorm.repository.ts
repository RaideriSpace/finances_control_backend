import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IGastoFixoRepository } from '../domain/gasto-fixo.repository';
import { GastoFixo, NovoGastoFixo } from '../domain/gasto-fixo.entity';
import { GastoFixoOrmEntity } from './gasto-fixo.orm-entity';
import { GastoFixoMapper } from './gasto-fixo.mapper';

@Injectable()
export class GastoFixoTypeOrmRepository implements IGastoFixoRepository {
  constructor(
    @InjectRepository(GastoFixoOrmEntity)
    private readonly repository: Repository<GastoFixoOrmEntity>,
  ) {}

  async findAll(params?: {
    offset?: number;
    limit?: number;
  }): Promise<GastoFixo[]> {
    const rows = await this.repository.find({
      skip: params?.offset,
      take: params?.limit,
    });
    return rows.map((row) => GastoFixoMapper.toDomain(row));
  }

  async findById(id: string): Promise<GastoFixo | null> {
    const row = await this.repository.findOneBy({ id });
    return row ? GastoFixoMapper.toDomain(row) : null;
  }

  async create(gastoFixo: NovoGastoFixo): Promise<GastoFixo> {
    const entity = this.repository.create(
      GastoFixoMapper.toPersistence(gastoFixo),
    );
    const saved = await this.repository.save(entity);
    return GastoFixoMapper.toDomain(saved);
  }

  async updateFields(
    id: string,
    partial: Partial<Omit<GastoFixo, 'id'>>,
  ): Promise<GastoFixo | null> {
    const preloaded = await this.repository.preload({ id, ...partial });
    if (!preloaded) return null;
    const saved = await this.repository.save(preloaded);
    return GastoFixoMapper.toDomain(saved);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
