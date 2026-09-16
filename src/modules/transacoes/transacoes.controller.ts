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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UpdateTransacaoDto } from './application/dto/update-transacao.dto';
import { CreateTransacaoDto } from './application/dto/create-transacao.dto';
import { ListQueryDto } from '../common/pagination/list-query.dto';
import { ListarTransacoesUseCase } from './application/use-cases/listar-transacoes.use-case';
import { BuscarTransacaoUseCase } from './application/use-cases/buscar-transacao.use-case';
import { CriarTransacaoUseCase } from './application/use-cases/criar-transacao.use-case';
import { AtualizarTransacaoUseCase } from './application/use-cases/atualizar-transacao.use-case';
import { RemoverTransacaoUseCase } from './application/use-cases/remover-transacao.use-case';
import { TransacaoResponseDto } from './transacao.response.dto';

@ApiTags('Transacoes')
@Controller('transacoes')
export class TransacoesController {
  constructor(
    private readonly listarTransacoes: ListarTransacoesUseCase,
    private readonly buscarTransacao: BuscarTransacaoUseCase,
    private readonly criarTransacao: CriarTransacaoUseCase,
    private readonly atualizarTransacao: AtualizarTransacaoUseCase,
    private readonly removerTransacao: RemoverTransacaoUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as transações' })
  @ApiResponse({ status: 200, type: [TransacaoResponseDto] })
  async findAll(@Query() query: ListQueryDto): Promise<TransacaoResponseDto[]> {
    return this.listarTransacoes.execute(query);
  }

  @Get('busca/nome')
  @ApiOperation({ summary: 'Buscar transações por nome parcial ou total' })
  @ApiQuery({
    name: 'nome',
    required: true,
    description: 'Trecho do nome da compra',
  })
  @ApiResponse({ status: 200, type: [TransacaoResponseDto] })
  async findByName(
    @Query('nome') nome: string,
  ): Promise<TransacaoResponseDto[]> {
    return this.buscarTransacao.porNome(nome);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma transação pelo ID' })
  @ApiResponse({ status: 200, type: TransacaoResponseDto })
  async findOne(@Param('id') id: string): Promise<TransacaoResponseDto> {
    return this.buscarTransacao.porId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova transação' })
  @ApiResponse({
    status: 201,
    type: [TransacaoResponseDto],
    description:
      'Retorna um array: uma transação parcelada gera uma linha por parcela',
  })
  async create(
    @Body() createTransacaoDto: CreateTransacaoDto,
  ): Promise<TransacaoResponseDto[]> {
    return this.criarTransacao.execute(createTransacaoDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar campos de uma transação' })
  @ApiResponse({ status: 200, type: TransacaoResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateTransacaoDto: UpdateTransacaoDto,
  ): Promise<TransacaoResponseDto> {
    return this.atualizarTransacao.execute(id, updateTransacaoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma transação pelo ID' })
  @ApiResponse({ status: 204, description: 'Transação removida com sucesso' })
  @ApiResponse({ status: 404, description: 'ID não encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.removerTransacao.execute(id);
  }
}
