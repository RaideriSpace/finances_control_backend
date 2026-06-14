import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recorrencia } from './entities/recorrencia.entity';
import { RecorrenciasService } from './recorrencias.service';
import { RecorrenciasController } from './recorrencias.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Recorrencia])],
  controllers: [RecorrenciasController],
  providers: [RecorrenciasService],
})

export class RecorrenciasModule {}
