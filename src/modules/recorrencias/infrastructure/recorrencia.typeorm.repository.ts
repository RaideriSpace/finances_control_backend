import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRecorrenciaRepository } from '../domain/recorrencia.repository';
import { NovaRecorrencia, Recorrencia } from '../domain/recorrencia.entity';
import { RecorrenciaOrmEntity } from './recorrencia.orm-entity';
import { RecorrenciaMapper } from './recorrencia.mapper';

@Injectable()
export class RecorrenciaTypeOrmRepository implements IRecorrenciaRepository {
  constructor(
    @InjectRepository(RecorrenciaOrmEntity)
    private readonly repository: Repository<RecorrenciaOrmEntity>,
  ) {}

  async findAll(params?: {
    offset?: number;
    limit?: number;
  }): Promise<Recorrencia[]> {
    const rows = await this.repository.find({
      skip: params?.offset,
      take: params?.limit,
    });
    return rows.map((row) => RecorrenciaMapper.toDomain(row));
  }

  async findById(id: string): Promise<Recorrencia | null> {
    const row = await this.repository.findOneBy({ id });
    return row ? RecorrenciaMapper.toDomain(row) : null;
  }

  async create(recorrencia: NovaRecorrencia): Promise<Recorrencia> {
    const entity = this.repository.create(
      RecorrenciaMapper.toPersistence(recorrencia),
    );
    const saved = await this.repository.save(entity);
    return RecorrenciaMapper.toDomain(saved);
  }

  async updateFields(
    id: string,
    partial: Partial<Omit<Recorrencia, 'id'>>,
  ): Promise<Recorrencia | null> {
    const preloaded = await this.repository.preload({ id, ...partial });
    if (!preloaded) return null;
    const saved = await this.repository.save(preloaded);
    return RecorrenciaMapper.toDomain(saved);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
