import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transacao } from './entities/transacao.entity';
import { UpdateTransacaoDto } from './dto/update-transacao.dto';
import { CreateTransacaoDto } from './dto/create-transacao.dto';

@Injectable()
export class TransacoesService {
  constructor(
    @InjectRepository(Transacao)
    private readonly repository: Repository<Transacao>,
  ) {}

  // Busca todas as transações
  async findAll(): Promise<Transacao[]> {
    return await this.repository.find();
  }

  // Busca uma transação específica pelo ID
  async findOne(id: string): Promise<Transacao | null> {
    return await this.repository.findOneBy({ id });
  }

  async create(dto: CreateTransacaoDto): Promise<Transacao> {
    const novaTransacao = this.repository.create(dto);
    return await this.repository.save(novaTransacao);
  }

  async update(id: string, dto: UpdateTransacaoDto): Promise<Transacao> {
    // O preload procura pela entidade e já "prepara" as alterações do DTO
    const transacao = await this.repository.preload({
      id: id,
      ...dto,
    });

    if (!transacao) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada`);
    }

    return await this.repository.save(transacao);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);

    // Se o 'affected' for 0, significa que não encontrou nada com esse ID
    if (result.affected === 0) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada`);
    }
  }
}
