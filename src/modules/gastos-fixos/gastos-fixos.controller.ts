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
import { GastosFixosService } from './gastos-fixos.service';
import { GastoFixo } from './entities/gasto-fixo.entity';
import { CreateGastoFixoDto } from './dto/create-gasto-fixo.dto';
import { UpdateGastoFixoDto } from './dto/update-gasto-fixo.dto';


@ApiTags('Gastos Fixos')
@Controller('gastos-fixos')
export class GastosFixosController {
  constructor(private readonly gastosFixosService: GastosFixosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os gastos fixos' })
  async findAll(): Promise<GastoFixo[]> {
    return this.gastosFixosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um gasto fixo pelo ID' })
  async findOne(@Param('id') id: string): Promise<GastoFixo> {
    return this.gastosFixosService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo gasto fixo' })
  async create(@Body() dto: CreateGastoFixoDto): Promise<GastoFixo> {
    return this.gastosFixosService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar campos de um gasto fixo' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGastoFixoDto,
  ): Promise<GastoFixo> {
    return this.gastosFixosService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um gasto fixo pelo ID' })
  @ApiResponse({ status: 204, description: 'Gasto fixo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'ID não encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.gastosFixosService.remove(id);
  }
}
