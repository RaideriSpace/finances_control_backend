import { Inject, Injectable } from '@nestjs/common';
import { RECORRENCIA_REPOSITORY } from '../../domain/recorrencia.repository';
import type { IRecorrenciaRepository } from '../../domain/recorrencia.repository';
import { Recorrencia } from '../../domain/recorrencia.entity';
import {
  TransacaoAcao,
  TransacaoCartao,
  TransacaoTipo,
} from '../../../transacoes/domain/transacao.constants';
import { CreateRecorrenciaDto } from '../dto/create-recorrencia.dto';

@Injectable()
export class CriarRecorrenciaUseCase {
  constructor(
    @Inject(RECORRENCIA_REPOSITORY)
    private readonly repository: IRecorrenciaRepository,
  ) {}

  async execute(dto: CreateRecorrenciaDto): Promise<Recorrencia> {
    return this.repository.create({
      compra: dto.compra,
      acao: dto.acao as TransacaoAcao,
      classificacao_1: dto.classificacao_1,
      classificacao_2: dto.classificacao_2 ?? null,
      tipo: dto.tipo as TransacaoTipo,
      parcelamento: dto.parcelamento,
      parcela: dto.parcela,
      local: dto.local ?? null,
      valorPadrao: dto.valorPadrao ?? null,
      cartaoPadrao: (dto.cartaoPadrao as TransacaoCartao) ?? null,
    });
  }
}
