import { Inject, Injectable, Logger } from '@nestjs/common';
import { RECORRENCIA_REPOSITORY } from '../../domain/recorrencia.repository';
import type { IRecorrenciaRepository } from '../../domain/recorrencia.repository';
import { TRANSACAO_REPOSITORY } from '../../../transacoes/domain/transacao.repository';
import type { ITransacaoRepository } from '../../../transacoes/domain/transacao.repository';
import { NovaTransacao } from '../../../transacoes/domain/transacao.entity';
import { calcularParcelas } from '../../../transacoes/domain/parcelamento';

function primeiroDiaDoMes(referencia: Date): string {
  return `${referencia.getFullYear()}-${String(referencia.getMonth() + 1).padStart(2, '0')}-01`;
}

/**
 * Gera transações automaticamente a partir de recorrências que têm
 * `valorPadrao` e `cartaoPadrao` definidos — só essas têm todos os campos
 * obrigatórios de uma transação sem depender de entrada manual do usuário.
 * Recorrências sem esses campos continuam exigindo o lançamento manual já
 * existente (endpoint usado pelo modal "Contas Recorrentes" no frontend).
 *
 * Idempotente por mês: cada recorrência só gera uma vez por `mesReferencia`,
 * controlado por `ultimaGeracao`.
 */
@Injectable()
export class GerarTransacoesRecorrentesUseCase {
  private readonly logger = new Logger(GerarTransacoesRecorrentesUseCase.name);

  constructor(
    @Inject(RECORRENCIA_REPOSITORY)
    private readonly recorrenciaRepository: IRecorrenciaRepository,
    @Inject(TRANSACAO_REPOSITORY)
    private readonly transacaoRepository: ITransacaoRepository,
  ) {}

  async execute(referencia: Date = new Date()): Promise<number> {
    const mesReferencia = primeiroDiaDoMes(referencia);
    const recorrencias = await this.recorrenciaRepository.findAll();

    let geradas = 0;
    for (const recorrencia of recorrencias) {
      const elegivel =
        recorrencia.valorPadrao !== null && recorrencia.cartaoPadrao !== null;
      const jaGeradaNesteMes =
        recorrencia.ultimaGeracao?.startsWith(mesReferencia) ?? false;

      if (!elegivel || jaGeradaNesteMes) continue;

      const calculo = calcularParcelas(
        recorrencia.tipo,
        recorrencia.parcelamento,
        mesReferencia,
      );

      const novasTransacoes: NovaTransacao[] = calculo.parcelas.map(
        (parcela) => ({
          compra: recorrencia.compra,
          acao: recorrencia.acao,
          classificacao_1: recorrencia.classificacao_1,
          classificacao_2: recorrencia.classificacao_2,
          cartao: recorrencia.cartaoPadrao!,
          cartaoDestino: null,
          tipo: recorrencia.tipo,
          parcelamento: recorrencia.parcelamento,
          parcela: parcela.parcela,
          valor: recorrencia.valorPadrao!,
          data_inicio: calculo.dataInicio,
          data_fim: calculo.dataFim,
          local: recorrencia.local,
          data_pagamento: parcela.dataPagamento,
          recorrenciaId: recorrencia.id,
        }),
      );

      await this.transacaoRepository.createMany(novasTransacoes);
      await this.recorrenciaRepository.updateFields(recorrencia.id, {
        ultimaGeracao: mesReferencia,
      });
      geradas += 1;
    }

    if (geradas > 0) {
      this.logger.log(
        `${geradas} recorrência(s) geraram transações para ${mesReferencia}`,
      );
    }
    return geradas;
  }
}
