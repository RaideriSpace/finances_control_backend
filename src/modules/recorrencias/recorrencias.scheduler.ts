import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GerarTransacoesRecorrentesUseCase } from './application/use-cases/gerar-transacoes-recorrentes.use-case';

@Injectable()
export class RecorrenciasScheduler {
  private readonly logger = new Logger(RecorrenciasScheduler.name);

  constructor(
    private readonly gerarTransacoesRecorrentes: GerarTransacoesRecorrentesUseCase,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async gerarTransacoesDoMes(): Promise<void> {
    try {
      await this.gerarTransacoesRecorrentes.execute();
    } catch (error) {
      this.logger.error(
        'Falha ao gerar transações automáticas de recorrências',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
