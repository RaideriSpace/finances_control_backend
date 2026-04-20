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
import { TransacoesService } from './transacoes.service';
import { Transacao } from './entities/transacao.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UpdateTransacaoDto } from './dto/update-transacao.dto';
import { CreateTransacaoDto } from './dto/create-transacao.dto';

@ApiTags('Transacoes')
@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as transações' })
  async findAll(): Promise<Transacao[]> {
    return this.transacoesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma transação pelo ID' })
  async findOne(@Param('id') id: string): Promise<Transacao | null> {
    return this.transacoesService.findOne(id);
  }

  @Get('busca/nome')
  @ApiOperation({ summary: 'Buscar transações por nome parcial ou total' })
  @ApiQuery({
    name: 'nome',
    required: true,
    description: 'Trecho do nome da compra',
  })
  async findByName(@Query('nome') nome: string): Promise<Transacao[]> {
    return this.transacoesService.findByName(nome);
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova transação' })
  async create(
    @Body() createTransacaoDto: CreateTransacaoDto,
  ): Promise<Transacao> {
    return this.transacoesService.create(createTransacaoDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar campos de uma transação' })
  async update(
    @Param('id') id: string,
    @Body() updateTransacaoDto: UpdateTransacaoDto,
  ): Promise<Transacao> {
    return this.transacoesService.update(id, updateTransacaoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 (Sucesso, mas sem conteúdo no corpo)
  @ApiOperation({ summary: 'Remover uma transação pelo ID' })
  @ApiResponse({ status: 204, description: 'Transação removida com sucesso' })
  @ApiResponse({ status: 404, description: 'ID não encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.transacoesService.remove(id);
  }
}
