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
        // Substituído 'estabelecimento' por 'local'
        { local: ILike(`%${nome}%`) },
      ],
    });
  }

  async create(payload: CreateTransacaoDto) {
    // 1. Garantimos que a data_inicio é uma string YYYY-MM-DD
    const dataInicioString = new Date(payload.data_inicio)
      .toISOString()
      .split('T')[0];

    // Se for débito, o fluxo é simples: 1 parcela, data_pagamento e data_fim são hoje
    if (payload.tipo === 'debito' || payload.parcelamento <= 1) {
      const transacao = {
        ...payload,
        data_inicio: dataInicioString,
        data_fim: dataInicioString, // <-- AUTO-CALCULADO
        data_pagamento: dataInicioString, // <-- AUTO-CALCULADO
      };

      return await this.repository.save(transacao as any);
    }

    // Se for crédito parcelado
    const transacoesParaSalvar: any[] = [];

    // CALCULANDO A DATA FIM DA COMPRA (Mês atual + total de parcelas - 1)
    const dataFimRef = new Date(payload.data_inicio);
    dataFimRef.setMonth(dataFimRef.getMonth() + (payload.parcelamento - 1));
    dataFimRef.setDate(5); // A última parcela sempre cai no dia 5
    const dataFimString = dataFimRef.toISOString().split('T')[0];

    for (let i = 0; i < payload.parcelamento; i++) {
      const dataRef = new Date(payload.data_inicio);
      let dataPagamentoDaParcela: string;

      if (i === 0) {
        dataPagamentoDaParcela = dataInicioString;
      } else {
        dataRef.setMonth(dataRef.getMonth() + i);
        dataRef.setDate(5);
        dataPagamentoDaParcela = dataRef.toISOString().split('T')[0];
      }

      const novaParcela = {
        ...payload,
        parcela: i + 1,
        data_inicio: dataInicioString,
        data_fim: dataFimString, // <-- INSERINDO A DATA CALCULADA
        data_pagamento: dataPagamentoDaParcela,
      };

      transacoesParaSalvar.push(novaParcela);
    }

    return await this.repository.save(transacoesParaSalvar as any);
  }

  async update(id: string, dto: UpdateTransacaoDto): Promise<Transacao> {
    const transacaoExistente = await this.repository.findOneBy({ id });

    if (!transacaoExistente) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada`);
    }

    const transacao = await this.repository.preload({
      id: id,
      ...dto,
    });

    if (!transacao) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada`);
    }

    // Se a data_inicio foi alterada, atualiza data_pagamento para o mesmo valor
    const dataInicioString = (d: Date | string) =>
      new Date(d).toISOString().split('T')[0];

    if (
      dto.data_inicio &&
      dataInicioString(dto.data_inicio) !==
        dataInicioString(transacaoExistente.data_inicio)
    ) {
      transacao.data_pagamento = dataInicioString(dto.data_inicio);
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
