import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TRANSACAO_REPOSITORY } from '../../domain/transacao.repository';
import type { ITransacaoRepository } from '../../domain/transacao.repository';
import { NovaTransacao, Transacao } from '../../domain/transacao.entity';
import {
  TransacaoAcao,
  TransacaoCartao,
  TransacaoTipo,
} from '../../domain/transacao.constants';
import { calcularParcelas } from '../../domain/parcelamento';
import { CreateTransacaoDto } from '../dto/create-transacao.dto';

/**
 * Ações que sempre envolvem duas contas e por isso geram duas linhas:
 * - 'transferência': saída débito na origem + depósito débito no destino
 *   (dinheiro muda de conta própria, não sai da carteira).
 * - 'pagamento' (de fatura): saída débito na conta de onde sai o dinheiro +
 *   depósito crédito no cartão cuja fatura está sendo paga (reduz o valor
 *   devido daquele cartão — ver lib/finance/faturas.ts no frontend).
 */
const ACOES_COM_CONTA_DESTINO = new Set<TransacaoAcao>([
  'transferência',
  'pagamento',
]);

@Injectable()
export class CriarTransacaoUseCase {
  constructor(
    @Inject(TRANSACAO_REPOSITORY)
    private readonly repository: ITransacaoRepository,
  ) {}

  /**
   * Uma transação parcelada expande em N linhas (uma por parcela) — por isso
   * o retorno é sempre um array, mesmo para débito (1 parcela). Transferência
   * e pagamento de fatura expandem em mais um nível: cada parcela da saída na
   * conta de origem gera também uma linha espelhada na conta de destino
   * (mesmo valor, mesma data).
   */
  async execute(dto: CreateTransacaoDto): Promise<Transacao[]> {
    const temContaDestino = ACOES_COM_CONTA_DESTINO.has(
      dto.acao as TransacaoAcao,
    );

    if (temContaDestino) {
      if (dto.tipo !== 'debito') {
        throw new BadRequestException(
          `${dto.acao === 'pagamento' ? 'Pagamento de fatura' : 'Transferência'} só pode ser lançado a partir de uma conta débito`,
        );
      }
      if (!dto.cartaoDestino) {
        throw new BadRequestException(
          'Informe a conta de destino (cartaoDestino)',
        );
      }
      // Pagar a fatura do próprio cartão com a conta débito do mesmo banco é
      // uso comum (ex.: nubank débito pagando nubank crédito) — só a
      // transferência entre duas contas débito exige contas diferentes.
      if (dto.acao === 'transferência' && dto.cartaoDestino === dto.cartao) {
        throw new BadRequestException(
          'A conta de destino deve ser diferente da conta de origem',
        );
      }
    }

    const calculo = calcularParcelas(
      dto.tipo as TransacaoTipo,
      dto.parcelamento,
      dto.data_inicio,
    );

    const saida: NovaTransacao[] = calculo.parcelas.map((parcela) => ({
      compra: dto.compra,
      acao: dto.acao as TransacaoAcao,
      classificacao_1: dto.classificacao_1,
      classificacao_2: dto.classificacao_2 ?? null,
      cartao: dto.cartao as TransacaoCartao,
      cartaoDestino: temContaDestino
        ? (dto.cartaoDestino as TransacaoCartao)
        : null,
      tipo: dto.tipo as TransacaoTipo,
      parcelamento: dto.parcelamento,
      parcela: parcela.parcela,
      valor: dto.valor,
      data_inicio: calculo.dataInicio,
      data_fim: calculo.dataFim,
      local: temContaDestino
        ? `Para ${dto.cartaoDestino}`
        : (dto.local ?? null),
      data_pagamento: parcela.dataPagamento,
      recorrenciaId: null,
    }));

    if (!temContaDestino) {
      return this.repository.createMany(saida);
    }

    // Pagamento de fatura credita a conta de destino em crédito (abate o que
    // é devido nela); transferência credita em débito (dinheiro disponível
    // na conta de destino).
    const tipoDestino: TransacaoTipo =
      dto.acao === 'pagamento' ? 'credito' : 'debito';

    const entrada: NovaTransacao[] = saida.map((transacao) => ({
      ...transacao,
      acao: 'depósito',
      tipo: tipoDestino,
      cartao: dto.cartaoDestino as TransacaoCartao,
      cartaoDestino: null,
      local: `De ${dto.cartao}`,
    }));

    return this.repository.createMany([...saida, ...entrada]);
  }
}
