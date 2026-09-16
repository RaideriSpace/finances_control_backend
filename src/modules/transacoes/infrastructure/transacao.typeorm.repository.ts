import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ITransacaoRepository } from '../domain/transacao.repository';
import { NovaTransacao, Transacao } from '../domain/transacao.entity';
import { TransacaoOrmEntity } from './transacao.orm-entity';
import { TransacaoMapper } from './transacao.mapper';

@Injectable()
export class TransacaoTypeOrmRepository implements ITransacaoRepository {
  constructor(
    @InjectRepository(TransacaoOrmEntity)
    private readonly repository: Repository<TransacaoOrmEntity>,
  ) {}

  async findAll(params?: {
    offset?: number;
    limit?: number;
  }): Promise<Transacao[]> {
    const rows = await this.repository.find({
      skip: params?.offset,
      take: params?.limit,
    });
    return rows.map((row) => TransacaoMapper.toDomain(row));
  }

  async findById(id: string): Promise<Transacao | null> {
    const row = await this.repository.findOneBy({ id });
    return row ? TransacaoMapper.toDomain(row) : null;
  }

  async findByName(nome: string): Promise<Transacao[]> {
    const rows = await this.repository.find({
      where: [{ compra: ILike(`%${nome}%`) }, { local: ILike(`%${nome}%`) }],
    });
    return rows.map((row) => TransacaoMapper.toDomain(row));
  }

  async createMany(transacoes: NovaTransacao[]): Promise<Transacao[]> {
    const entities = this.repository.create(
      transacoes.map((transacao) => TransacaoMapper.toPersistence(transacao)),
    );
    const saved = await this.repository.save(entities);
    return saved.map((entity) => TransacaoMapper.toDomain(entity));
  }

  async updateFields(
    id: string,
    partial: Partial<Omit<Transacao, 'id'>>,
  ): Promise<Transacao | null> {
    const preloaded = await this.repository.preload({ id, ...partial });
    if (!preloaded) return null;
    const saved = await this.repository.save(preloaded);
    return TransacaoMapper.toDomain(saved);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
