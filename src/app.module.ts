import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransacoesModule } from './modules/transacoes/transacoes.module';
import { GastosFixosModule } from './modules/gastos-fixos/gastos-fixos.module';
import { SaldoModule } from './modules/saldo/saldo.module';
import { RecorrenciasModule } from './modules/recorencias/recorrencias.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        ssl: true,
        connectTimeoutMS: 15000,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
          keepalives: 1,
          keepalives_idle: 60,
        },
      }),
    }),
    TransacoesModule,
    RecorrenciasModule,
    GastosFixosModule,
    SaldoModule,
  ],
})
export class AppModule {}
