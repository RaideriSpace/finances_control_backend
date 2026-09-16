import {
  TransacaoAcao,
  TransacaoCartao,
  TransacaoTipo,
} from '../domain/transacao.constants';
import { NovaTransacao, Transacao } from '../domain/transacao.entity';
import { TransacaoOrmEntity } from './transacao.orm-entity';

export class TransacaoMapper {
  static toDomain(orm: TransacaoOrmEntity): Transacao {
    return {
      id: orm.id,
      compra: orm.compra,
      acao: orm.acao as TransacaoAcao,
      classificacao_1: orm.classificacao_1,
      classificacao_2: orm.classificacao_2,
      cartao: orm.cartao as TransacaoCartao,
      cartaoDestino: orm.cartaoDestino as TransacaoCartao | null,
      tipo: orm.tipo as TransacaoTipo,
      parcelamento: orm.parcelamento,
      parcela: orm.parcela,
      valor: orm.valor,
      data_inicio: String(orm.data_inicio).slice(0, 10),
      data_fim: String(orm.data_fim).slice(0, 10),
      local: orm.local,
      data_pagamento: orm.data_pagamento,
      recorrenciaId: orm.recorrenciaId,
    };
  }

  static toPersistence(transacao: NovaTransacao): Partial<TransacaoOrmEntity> {
    return { ...transacao };
  }
}
