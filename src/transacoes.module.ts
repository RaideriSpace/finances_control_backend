import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transacao } from './transacao.entity';
import { TransacoesService } from './transacoes.service';
import { TransacoesController } from './transacoes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transacao])],
  controllers: [TransacoesController],
  providers: [TransacoesService],
})
export class TransacoesModule {}
