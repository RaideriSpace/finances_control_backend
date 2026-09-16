import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransacoesModule } from '../transacoes/transacoes.module';
import { RecorrenciaOrmEntity } from './infrastructure/recorrencia.orm-entity';
import { RecorrenciaTypeOrmRepository } from './infrastructure/recorrencia.typeorm.repository';
import { RECORRENCIA_REPOSITORY } from './domain/recorrencia.repository';
import { RecorrenciasController } from './recorrencias.controller';
import { RecorrenciasScheduler } from './recorrencias.scheduler';
import { ListarRecorrenciasUseCase } from './application/use-cases/listar-recorrencias.use-case';
import { BuscarRecorrenciaUseCase } from './application/use-cases/buscar-recorrencia.use-case';
import { CriarRecorrenciaUseCase } from './application/use-cases/criar-recorrencia.use-case';
import { AtualizarRecorrenciaUseCase } from './application/use-cases/atualizar-recorrencia.use-case';
import { RemoverRecorrenciaUseCase } from './application/use-cases/remover-recorrencia.use-case';
import { GerarTransacoesRecorrentesUseCase } from './application/use-cases/gerar-transacoes-recorrentes.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([RecorrenciaOrmEntity]), TransacoesModule],
  controllers: [RecorrenciasController],
  providers: [
    {
      provide: RECORRENCIA_REPOSITORY,
      useClass: RecorrenciaTypeOrmRepository,
    },
    ListarRecorrenciasUseCase,
    BuscarRecorrenciaUseCase,
    CriarRecorrenciaUseCase,
    AtualizarRecorrenciaUseCase,
    RemoverRecorrenciaUseCase,
    GerarTransacoesRecorrentesUseCase,
    RecorrenciasScheduler,
  ],
})
export class RecorrenciasModule {}
