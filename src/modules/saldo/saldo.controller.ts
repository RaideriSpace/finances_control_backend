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
import { CreateSaldoDto } from './application/dto/create-saldo.dto';
import { UpdateSaldoDto } from './application/dto/update-saldo.dto';
import { ListarSaldosUseCase } from './application/use-cases/listar-saldos.use-case';
import { ListarSaldoAtualUseCase } from './application/use-cases/listar-saldo-atual.use-case';
import { BuscarSaldoUseCase } from './application/use-cases/buscar-saldo.use-case';
import { CriarSaldoUseCase } from './application/use-cases/criar-saldo.use-case';
import { AtualizarSaldoUseCase } from './application/use-cases/atualizar-saldo.use-case';
import { RemoverSaldoUseCase } from './application/use-cases/remover-saldo.use-case';
import { SaldoResponseDto } from './saldo.response.dto';

@ApiTags('Saldo')
@Controller('saldo')
export class SaldoController {
  constructor(
    private readonly listarSaldos: ListarSaldosUseCase,
    private readonly listarSaldoAtual: ListarSaldoAtualUseCase,
    private readonly buscarSaldo: BuscarSaldoUseCase,
    private readonly criarSaldo: CriarSaldoUseCase,
    private readonly atualizarSaldo: AtualizarSaldoUseCase,
    private readonly removerSaldo: RemoverSaldoUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os registros de saldo' })
  @ApiResponse({ status: 200, type: [SaldoResponseDto] })
  async findAll(): Promise<SaldoResponseDto[]> {
    return this.listarSaldos.execute();
  }

  @Get('atual')
  @ApiOperation({
    summary: 'Listar registros de saldo do ciclo vigente de cada fonte',
  })
  @ApiResponse({ status: 200, type: [SaldoResponseDto] })
  async findAtual(): Promise<SaldoResponseDto[]> {
    return this.listarSaldoAtual.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um registro de saldo pelo ID' })
  @ApiResponse({ status: 200, type: SaldoResponseDto })
  async findOne(@Param('id') id: string): Promise<SaldoResponseDto> {
    return this.buscarSaldo.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo registro de saldo' })
  @ApiResponse({ status: 201, type: SaldoResponseDto })
  async create(@Body() dto: CreateSaldoDto): Promise<SaldoResponseDto> {
    return this.criarSaldo.execute(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar campos de um registro de saldo' })
  @ApiResponse({ status: 200, type: SaldoResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSaldoDto,
  ): Promise<SaldoResponseDto> {
    return this.atualizarSaldo.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um registro de saldo pelo ID' })
  @ApiResponse({ status: 204, description: 'Saldo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'ID não encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.removerSaldo.execute(id);
  }
}
