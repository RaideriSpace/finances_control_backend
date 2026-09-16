import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastoFixoOrmEntity } from './infrastructure/gasto-fixo.orm-entity';
import { GastoFixoTypeOrmRepository } from './infrastructure/gasto-fixo.typeorm.repository';
import { GASTO_FIXO_REPOSITORY } from './domain/gasto-fixo.repository';
import { GastosFixosController } from './gastos-fixos.controller';
import { ListarGastosFixosUseCase } from './application/use-cases/listar-gastos-fixos.use-case';
import { BuscarGastoFixoUseCase } from './application/use-cases/buscar-gasto-fixo.use-case';
import { CriarGastoFixoUseCase } from './application/use-cases/criar-gasto-fixo.use-case';
import { AtualizarGastoFixoUseCase } from './application/use-cases/atualizar-gasto-fixo.use-case';
import { RemoverGastoFixoUseCase } from './application/use-cases/remover-gasto-fixo.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([GastoFixoOrmEntity])],
  controllers: [GastosFixosController],
  providers: [
    { provide: GASTO_FIXO_REPOSITORY, useClass: GastoFixoTypeOrmRepository },
    ListarGastosFixosUseCase,
    BuscarGastoFixoUseCase,
    CriarGastoFixoUseCase,
    AtualizarGastoFixoUseCase,
    RemoverGastoFixoUseCase,
  ],
})
export class GastosFixosModule {}
