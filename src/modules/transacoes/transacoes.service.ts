import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Transacao } from './entities/transacao.entity';
import { UpdateTransacaoDto } from './dto/update-transacao.dto';
import { CreateTransacaoDto } from './dto/create-transacao.dto';

@Injectable()
export class TransacoesService {
  constructor(
    @InjectRepository(Transacao)
    private readonly repository: Repository<Transacao>,
  ) {}

  async findAll(): Promise<Transacao[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<Transacao | null> {
    return await this.repository.findOneBy({ id });
  }

  async findByName(nome: string): Promise<Transacao[]> {
    return await this.repository.find({
      where: [
        { compra: ILike(`%${nome}%`) },
        { estabelecimento: ILike(`%${nome}%`) },
      ],
    });
  }

  async create(dto: CreateTransacaoDto): Promise<Transacao> {
    const novaTransacao = this.repository.create(dto);
    return await this.repository.save(novaTransacao);
  }

  async update(id: string, dto: UpdateTransacaoDto): Promise<Transacao> {
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

    if (result.affected === 0) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada`);
    }
  }
}
