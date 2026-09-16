import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TRANSACAO_REPOSITORY } from '../../domain/transacao.repository';
import type { ITransacaoRepository } from '../../domain/transacao.repository';
import { Transacao } from '../../domain/transacao.entity';
import {
  TransacaoAcao,
  TransacaoCartao,
  TransacaoTipo,
} from '../../domain/transacao.constants';
import { calcularDataPagamentoParcela } from '../../domain/parcelamento';
import { UpdateTransacaoDto } from '../dto/update-transacao.dto';

@Injectable()
export class AtualizarTransacaoUseCase {
  constructor(
    @Inject(TRANSACAO_REPOSITORY)
    private readonly repository: ITransacaoRepository,
  ) {}

  async execute(id: string, dto: UpdateTransacaoDto): Promise<Transacao> {
    const existente = await this.repository.findById(id);
    if (!existente) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada`);
    }

    const partial: Partial<Omit<Transacao, 'id'>> = {
      ...dto,
      acao: dto.acao as TransacaoAcao | undefined,
      cartao: dto.cartao as TransacaoCartao | undefined,
      cartaoDestino: dto.cartaoDestino as TransacaoCartao | undefined,
      tipo: dto.tipo as TransacaoTipo | undefined,
    };

    // Recalcula a data de pagamento desta parcela com a mesma fórmula usada
    // na criação (ver domain/parcelamento.ts), em vez de sobrescrever com a
    // data bruta. Observação: isso corrige apenas a linha editada — parcelas
    // irmãs (criadas juntas em `create()`) não são vinculadas por um id de
    // grupo hoje, então não são resincronizadas automaticamente.
    if (dto.data_inicio) {
      const indice = (dto.parcela ?? existente.parcela) - 1;
      partial.data_pagamento = calcularDataPagamentoParcela(
        dto.data_inicio,
        indice,
      );
    }

    const atualizada = await this.repository.updateFields(id, partial);
    if (!atualizada) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada`);
    }
    return atualizada;
  }
}
