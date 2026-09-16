import { Inject, Injectable } from '@nestjs/common';
import { SALDO_REPOSITORY } from '../../domain/saldo.repository';
import type { ISaldoRepository } from '../../domain/saldo.repository';
import { Saldo } from '../../domain/saldo.entity';
import {
  SALDOS_PADRAO_MENSAL,
  calcularMesReferencia,
} from '../../domain/saldo.rules';

/**
 * Retorna os registros de saldo cujo mês de referência corresponde ao ciclo
 * vigente de cada fonte (dia de reset por fonte — ver domain/saldo.rules.ts),
 * garantindo antes que os saldos padrão do mês existam.
 *
 * Correção: a versão anterior comparava contra o mês de calendário
 * (`primeiroDiaDoMes`) tanto para seed quanto para leitura, então o dia de
 * reset por fonte nunca era de fato aplicado pelo backend — só o frontend
 * tinha uma cópia própria dessa conta (ModalSaldoFixos.tsx).
 */
@Injectable()
export class ListarSaldoAtualUseCase {
  constructor(
    @Inject(SALDO_REPOSITORY) private readonly repository: ISaldoRepository,
  ) {}

  async execute(): Promise<Saldo[]> {
    await this.garantirSaldosPadraoMensal();
    const todos = await this.repository.findAll();
    return todos.filter((saldo) => this.estaNoCicloVigente(saldo));
  }

  private estaNoCicloVigente(saldo: Saldo): boolean {
    if (!saldo.mes) return false;
    return saldo.mes.startsWith(calcularMesReferencia(saldo.fonte));
  }

  private async garantirSaldosPadraoMensal(): Promise<void> {
    const existentes = await this.repository.findAll();

    for (const saldoPadrao of SALDOS_PADRAO_MENSAL) {
      const mesReferencia = calcularMesReferencia(saldoPadrao.fonte);
      const existe = existentes.some(
        (saldo) =>
          saldo.fonte === saldoPadrao.fonte &&
          saldo.mes?.startsWith(mesReferencia),
      );

      if (!existe) {
        await this.repository.create({
          fonte: saldoPadrao.fonte,
          valor: saldoPadrao.valor,
          mes: mesReferencia,
        });
      }
    }
  }
}
