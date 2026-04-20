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
import { TransacoesService } from './transacoes.service';
import { Transacao } from './transacao.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTransacaoDto } from './create-transacao.dto';
import { UpdateTransacaoDto } from './update-transacao.dto';

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
