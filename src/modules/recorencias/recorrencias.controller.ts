import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RecorrenciasService } from './recorrencias.service';
import { Recorrencia } from './entities/recorrencia.entity';
import { CreateRecorrenciaDto } from './dto/create-recorrencia.dto';
import { UpdateRecorrenciaDto } from './dto/update-recorrencia.dto';

@ApiTags('Recorrências')
@Controller('recorrencias')
export class RecorrenciasController {
  constructor(private readonly recorrenciasService: RecorrenciasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as recorrências' })
  async findAll(): Promise<Recorrencia[]> {
    return this.recorrenciasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma recorrência pelo ID' })
  async findOne(@Param('id') id: string): Promise<Recorrencia> {
    return this.recorrenciasService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova recorrência' })
  async create(@Body() dto: CreateRecorrenciaDto): Promise<Recorrencia> {
    return this.recorrenciasService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar campos de uma recorrência' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRecorrenciaDto,
  ): Promise<Recorrencia> {
    return this.recorrenciasService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma recorrência pelo ID' })
  @ApiResponse({ status: 204, description: 'Recorrência removida com sucesso' })
  @ApiResponse({ status: 404, description: 'ID não encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.recorrenciasService.remove(id);
  }
}
