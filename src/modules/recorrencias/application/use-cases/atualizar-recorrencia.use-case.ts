import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RECORRENCIA_REPOSITORY } from '../../domain/recorrencia.repository';
import type { IRecorrenciaRepository } from '../../domain/recorrencia.repository';
import { Recorrencia } from '../../domain/recorrencia.entity';
import {
  TransacaoAcao,
  TransacaoCartao,
  TransacaoTipo,
} from '../../../transacoes/domain/transacao.constants';
import { UpdateRecorrenciaDto } from '../dto/update-recorrencia.dto';

@Injectable()
export class AtualizarRecorrenciaUseCase {
  constructor(
    @Inject(RECORRENCIA_REPOSITORY)
    private readonly repository: IRecorrenciaRepository,
  ) {}

  async execute(id: string, dto: UpdateRecorrenciaDto): Promise<Recorrencia> {
    const partial: Partial<Omit<Recorrencia, 'id'>> = {
      ...dto,
      acao: dto.acao as TransacaoAcao | undefined,
      tipo: dto.tipo as TransacaoTipo | undefined,
      cartaoPadrao: dto.cartaoPadrao as TransacaoCartao | undefined,
    };

    const atualizada = await this.repository.updateFields(id, partial);
    if (!atualizada) {
      throw new NotFoundException(`Recorrência com ID ${id} não encontrada`);
    }
    return atualizada;
  }
}
