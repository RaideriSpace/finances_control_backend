import { NovoSaldo, Saldo } from '../domain/saldo.entity';
import { clampSaldo } from '../domain/saldo.rules';
import { SaldoOrmEntity } from './saldo.orm-entity';

export class SaldoMapper {
  static toDomain(orm: SaldoOrmEntity): Saldo {
    return {
      id: orm.id,
      fonte: orm.fonte,
      valor: clampSaldo(orm.valor),
      mes: orm.mes,
    };
  }

  static toPersistence(saldo: NovoSaldo): Partial<SaldoOrmEntity> {
    return { ...saldo };
  }
}
