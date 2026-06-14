import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GastoFixo } from './entities/gasto-fixo.entity';
import { CreateGastoFixoDto } from './dto/create-gasto-fixo.dto';
import { UpdateGastoFixoDto } from './dto/update-gasto-fixo.dto';

@Injectable()
export class GastosFixosService {
  constructor(
    @InjectRepository(GastoFixo)
    private readonly repository: Repository<GastoFixo>,
  ) {}

  async findAll(): Promise<GastoFixo[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<GastoFixo> {
    const gasto = await this.repository.findOneBy({ id });

    if (!gasto) {
      throw new NotFoundException(`Gasto fixo com ID ${id} não encontrado`);
    }

    return gasto;
  }

  async create(dto: CreateGastoFixoDto): Promise<GastoFixo> {
    const gasto = this.repository.create(dto);
    return await this.repository.save(gasto);
  }

  async update(id: string, dto: UpdateGastoFixoDto): Promise<GastoFixo> {
    const gasto = await this.repository.preload({ id, ...dto });

    if (!gasto) {
      throw new NotFoundException(`Gasto fixo com ID ${id} não encontrado`);
    }

    return await this.repository.save(gasto);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Gasto fixo com ID ${id} não encontrado`);
    }
  }
}
