import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saldo } from './entities/saldo.entity';
import { SaldoService } from './saldo.service';
import { SaldoController } from './saldo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Saldo])],
  controllers: [SaldoController],
  providers: [SaldoService],
})
export class SaldoModule {}
