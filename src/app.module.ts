import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './modules/config/env.validation';
import { TransacoesModule } from './modules/transacoes/transacoes.module';
import { GastosFixosModule } from './modules/gastos-fixos/gastos-fixos.module';
import { SaldoModule } from './modules/saldo/saldo.module';
import { RecorrenciasModule } from './modules/recorrencias/recorrencias.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.orm-entity{.ts,.js}'],
        ssl: true,
        connectTimeoutMS: 15000,
        extra: {
          // Default preserva o comportamento atual (certificado do pooler
          // gerenciado não é validado); defina DB_SSL_REJECT_UNAUTHORIZED=true
          // para exigir validação estrita em ambientes que suportem.
          ssl: {
            rejectUnauthorized:
              configService.get<string>('DB_SSL_REJECT_UNAUTHORIZED') ===
              'true',
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
    DashboardModule,
  ],
})
export class AppModule {}
