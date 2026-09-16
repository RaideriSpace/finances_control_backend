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
import { CreateGastoFixoDto } from './application/dto/create-gasto-fixo.dto';
import { UpdateGastoFixoDto } from './application/dto/update-gasto-fixo.dto';
import { ListarGastosFixosUseCase } from './application/use-cases/listar-gastos-fixos.use-case';
import { BuscarGastoFixoUseCase } from './application/use-cases/buscar-gasto-fixo.use-case';
import { CriarGastoFixoUseCase } from './application/use-cases/criar-gasto-fixo.use-case';
import { AtualizarGastoFixoUseCase } from './application/use-cases/atualizar-gasto-fixo.use-case';
import { RemoverGastoFixoUseCase } from './application/use-cases/remover-gasto-fixo.use-case';
import { GastoFixoResponseDto } from './gasto-fixo.response.dto';

@ApiTags('Gastos Fixos')
@Controller('gastos-fixos')
export class GastosFixosController {
  constructor(
    private readonly listarGastosFixos: ListarGastosFixosUseCase,
    private readonly buscarGastoFixo: BuscarGastoFixoUseCase,
    private readonly criarGastoFixo: CriarGastoFixoUseCase,
    private readonly atualizarGastoFixo: AtualizarGastoFixoUseCase,
    private readonly removerGastoFixo: RemoverGastoFixoUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os gastos fixos' })
  @ApiResponse({ status: 200, type: [GastoFixoResponseDto] })
  async findAll(): Promise<GastoFixoResponseDto[]> {
    return this.listarGastosFixos.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um gasto fixo pelo ID' })
  @ApiResponse({ status: 200, type: GastoFixoResponseDto })
  async findOne(@Param('id') id: string): Promise<GastoFixoResponseDto> {
    return this.buscarGastoFixo.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo gasto fixo' })
  @ApiResponse({ status: 201, type: GastoFixoResponseDto })
  async create(@Body() dto: CreateGastoFixoDto): Promise<GastoFixoResponseDto> {
    return this.criarGastoFixo.execute(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar campos de um gasto fixo' })
  @ApiResponse({ status: 200, type: GastoFixoResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGastoFixoDto,
  ): Promise<GastoFixoResponseDto> {
    return this.atualizarGastoFixo.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um gasto fixo pelo ID' })
  @ApiResponse({ status: 204, description: 'Gasto fixo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'ID não encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.removerGastoFixo.execute(id);
  }
}
