import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaldoOrmEntity } from './infrastructure/saldo.orm-entity';
import { SaldoTypeOrmRepository } from './infrastructure/saldo.typeorm.repository';
import { SALDO_REPOSITORY } from './domain/saldo.repository';
import { SaldoController } from './saldo.controller';
import { ListarSaldosUseCase } from './application/use-cases/listar-saldos.use-case';
import { ListarSaldoAtualUseCase } from './application/use-cases/listar-saldo-atual.use-case';
import { BuscarSaldoUseCase } from './application/use-cases/buscar-saldo.use-case';
import { CriarSaldoUseCase } from './application/use-cases/criar-saldo.use-case';
import { AtualizarSaldoUseCase } from './application/use-cases/atualizar-saldo.use-case';
import { RemoverSaldoUseCase } from './application/use-cases/remover-saldo.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([SaldoOrmEntity])],
  controllers: [SaldoController],
  providers: [
    { provide: SALDO_REPOSITORY, useClass: SaldoTypeOrmRepository },
    ListarSaldosUseCase,
    ListarSaldoAtualUseCase,
    BuscarSaldoUseCase,
    CriarSaldoUseCase,
    AtualizarSaldoUseCase,
    RemoverSaldoUseCase,
  ],
})
export class SaldoModule {}
