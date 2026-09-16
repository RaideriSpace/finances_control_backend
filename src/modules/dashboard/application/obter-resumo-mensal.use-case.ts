import { Inject, Injectable } from '@nestjs/common';
import { TRANSACAO_REPOSITORY } from '../../transacoes/domain/transacao.repository';
import type { ITransacaoRepository } from '../../transacoes/domain/transacao.repository';
import { calcularResumoMensal, ResumoMensal } from '../domain/resumo-mensal';

function mesAtual(): string {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
}

@Injectable()
export class ObterResumoMensalUseCase {
  constructor(
    @Inject(TRANSACAO_REPOSITORY)
    private readonly transacaoRepository: ITransacaoRepository,
  ) {}

  async execute(mes: string = mesAtual()): Promise<ResumoMensal> {
    const transacoes = await this.transacaoRepository.findAll();
    return calcularResumoMensal(transacoes, mes);
  }
}
