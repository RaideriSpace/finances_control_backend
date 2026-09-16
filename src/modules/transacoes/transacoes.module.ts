import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransacaoOrmEntity } from './infrastructure/transacao.orm-entity';
import { TransacaoTypeOrmRepository } from './infrastructure/transacao.typeorm.repository';
import { TRANSACAO_REPOSITORY } from './domain/transacao.repository';
import { TransacoesController } from './transacoes.controller';
import { ListarTransacoesUseCase } from './application/use-cases/listar-transacoes.use-case';
import { BuscarTransacaoUseCase } from './application/use-cases/buscar-transacao.use-case';
import { CriarTransacaoUseCase } from './application/use-cases/criar-transacao.use-case';
import { AtualizarTransacaoUseCase } from './application/use-cases/atualizar-transacao.use-case';
import { RemoverTransacaoUseCase } from './application/use-cases/remover-transacao.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([TransacaoOrmEntity])],
  controllers: [TransacoesController],
  providers: [
    { provide: TRANSACAO_REPOSITORY, useClass: TransacaoTypeOrmRepository },
    ListarTransacoesUseCase,
    BuscarTransacaoUseCase,
    CriarTransacaoUseCase,
    AtualizarTransacaoUseCase,
    RemoverTransacaoUseCase,
  ],
  exports: [TRANSACAO_REPOSITORY, ListarTransacoesUseCase],
})
export class TransacoesModule {}
