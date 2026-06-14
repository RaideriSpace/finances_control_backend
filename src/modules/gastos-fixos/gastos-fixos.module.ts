import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastoFixo } from './entities/gasto-fixo.entity';
import { GastosFixosService } from './gastos-fixos.service';
import { GastosFixosController } from './gastos-fixos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GastoFixo])],
  controllers: [GastosFixosController],
  providers: [GastosFixosService],
})
export class GastosFixosModule {}
