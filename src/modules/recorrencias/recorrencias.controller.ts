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
import { CreateRecorrenciaDto } from './application/dto/create-recorrencia.dto';
import { UpdateRecorrenciaDto } from './application/dto/update-recorrencia.dto';
import { ListarRecorrenciasUseCase } from './application/use-cases/listar-recorrencias.use-case';
import { BuscarRecorrenciaUseCase } from './application/use-cases/buscar-recorrencia.use-case';
import { CriarRecorrenciaUseCase } from './application/use-cases/criar-recorrencia.use-case';
import { AtualizarRecorrenciaUseCase } from './application/use-cases/atualizar-recorrencia.use-case';
import { RemoverRecorrenciaUseCase } from './application/use-cases/remover-recorrencia.use-case';
import { RecorrenciaResponseDto } from './recorrencia.response.dto';

@ApiTags('Recorrências')
@Controller('recorrencias')
export class RecorrenciasController {
  constructor(
    private readonly listarRecorrencias: ListarRecorrenciasUseCase,
    private readonly buscarRecorrencia: BuscarRecorrenciaUseCase,
    private readonly criarRecorrencia: CriarRecorrenciaUseCase,
    private readonly atualizarRecorrencia: AtualizarRecorrenciaUseCase,
    private readonly removerRecorrencia: RemoverRecorrenciaUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as recorrências' })
  @ApiResponse({ status: 200, type: [RecorrenciaResponseDto] })
  async findAll(): Promise<RecorrenciaResponseDto[]> {
    return this.listarRecorrencias.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma recorrência pelo ID' })
  @ApiResponse({ status: 200, type: RecorrenciaResponseDto })
  async findOne(@Param('id') id: string): Promise<RecorrenciaResponseDto> {
    return this.buscarRecorrencia.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova recorrência' })
  @ApiResponse({ status: 201, type: RecorrenciaResponseDto })
  async create(
    @Body() dto: CreateRecorrenciaDto,
  ): Promise<RecorrenciaResponseDto> {
    return this.criarRecorrencia.execute(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar campos de uma recorrência' })
  @ApiResponse({ status: 200, type: RecorrenciaResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRecorrenciaDto,
  ): Promise<RecorrenciaResponseDto> {
    return this.atualizarRecorrencia.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma recorrência pelo ID' })
  @ApiResponse({ status: 204, description: 'Recorrência removida com sucesso' })
  @ApiResponse({ status: 404, description: 'ID não encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.removerRecorrencia.execute(id);
  }
}
