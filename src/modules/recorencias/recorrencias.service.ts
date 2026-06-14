import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recorrencia } from './entities/recorrencia.entity';
import { CreateRecorrenciaDto } from './dto/create-recorrencia.dto';
import { UpdateRecorrenciaDto } from './dto/update-recorrencia.dto';

@Injectable()
export class RecorrenciasService {
  constructor(
    @InjectRepository(Recorrencia)
    private readonly repository: Repository<Recorrencia>,
  ) {}

  async findAll(): Promise<Recorrencia[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<Recorrencia> {
    const recorrencia = await this.repository.findOneBy({ id });

    if (!recorrencia) {
      throw new NotFoundException(`Recorrência com ID ${id} não encontrada`);
    }

    return recorrencia;
  }

  async create(dto: CreateRecorrenciaDto): Promise<Recorrencia> {
    const recorrencia = this.repository.create(dto);
    return await this.repository.save(recorrencia);
  }

  async update(id: string, dto: UpdateRecorrenciaDto): Promise<Recorrencia> {
    const recorrencia = await this.repository.preload({ id, ...dto });

    if (!recorrencia) {
      throw new NotFoundException(`Recorrência com ID ${id} não encontrada`);
    }

    return await this.repository.save(recorrencia);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Recorrência com ID ${id} não encontrada`);
    }
  }
}
