import { Module } from '@nestjs/common';
import { TransacoesModule } from '../transacoes/transacoes.module';
import { DashboardController } from './dashboard.controller';
import { ObterResumoMensalUseCase } from './application/obter-resumo-mensal.use-case';

@Module({
  imports: [TransacoesModule],
  controllers: [DashboardController],
  providers: [ObterResumoMensalUseCase],
})
export class DashboardModule {}
