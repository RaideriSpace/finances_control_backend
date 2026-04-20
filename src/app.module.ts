import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Transacao } from './modules/transacoes/entities/transacao.entity'; // ajuste o caminho
import { TransacoesModule } from './modules/transacoes/transacoes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Transacao],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Transacao]),
    TransacoesModule,
  ],
})
export class AppModule {}
