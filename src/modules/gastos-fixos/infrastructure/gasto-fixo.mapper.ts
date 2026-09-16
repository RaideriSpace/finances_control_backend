import { GastoFixo, NovoGastoFixo } from '../domain/gasto-fixo.entity';
import { GastoFixoOrmEntity } from './gasto-fixo.orm-entity';

export class GastoFixoMapper {
  static toDomain(orm: GastoFixoOrmEntity): GastoFixo {
    return { id: orm.id, nome: orm.nome, valor: orm.valor };
  }

  static toPersistence(gastoFixo: NovoGastoFixo): Partial<GastoFixoOrmEntity> {
    return { ...gastoFixo };
  }
}
