import {
  TransacaoAcao,
  TransacaoCartao,
  TransacaoTipo,
} from '../../transacoes/domain/transacao.constants';
import { NovaRecorrencia, Recorrencia } from '../domain/recorrencia.entity';
import { RecorrenciaOrmEntity } from './recorrencia.orm-entity';

export class RecorrenciaMapper {
  static toDomain(orm: RecorrenciaOrmEntity): Recorrencia {
    return {
      id: orm.id,
      compra: orm.compra,
      acao: orm.acao as TransacaoAcao,
      classificacao_1: orm.classificacao_1,
      classificacao_2: orm.classificacao_2,
      tipo: orm.tipo as TransacaoTipo,
      parcelamento: orm.parcelamento,
      parcela: orm.parcela,
      local: orm.local,
      valorPadrao: orm.valorPadrao,
      cartaoPadrao: orm.cartaoPadrao as TransacaoCartao | null,
      ultimaGeracao: orm.ultimaGeracao,
    };
  }

  static toPersistence(
    recorrencia: NovaRecorrencia,
  ): Partial<RecorrenciaOrmEntity> {
    return { ...recorrencia };
  }
}
