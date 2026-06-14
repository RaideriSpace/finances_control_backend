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
import { SaldoService } from './saldo.service';
import { Saldo } from './entities/saldo.entity';
import { CreateSaldoDto } from './dto/create-saldo.dto';
import { UpdateSaldoDto } from './dto/update-saldo.dto';

@ApiTags('Saldo')
@Controller('saldo')
export class SaldoController {
  constructor(private readonly saldoService: SaldoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os registros de saldo' })
  async findAll(): Promise<Saldo[]> {
    return this.saldoService.findAll();
  }

  @Get('atual')
  @ApiOperation({
    summary: 'Listar registros de saldo do ciclo vigente de cada fonte',
  })
  async findAtual(): Promise<Saldo[]> {
    return this.saldoService.findAtual();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um registro de saldo pelo ID' })
  async findOne(@Param('id') id: string): Promise<Saldo> {
    return this.saldoService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo registro de saldo' })
  async create(@Body() dto: CreateSaldoDto): Promise<Saldo> {
    return this.saldoService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar campos de um registro de saldo' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSaldoDto,
  ): Promise<Saldo> {
    return this.saldoService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um registro de saldo pelo ID' })
  @ApiResponse({ status: 204, description: 'Saldo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'ID não encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.saldoService.remove(id);
  }
}
