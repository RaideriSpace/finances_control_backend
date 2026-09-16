import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ObterResumoMensalUseCase } from './application/obter-resumo-mensal.use-case';
import { DashboardResumoDto } from './dashboard-resumo.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly obterResumoMensal: ObterResumoMensalUseCase) {}

  @Get('mensal')
  @ApiOperation({ summary: 'Resumo financeiro do mês' })
  @ApiQuery({ name: 'mes', required: false, example: '2026-09' })
  @ApiResponse({ status: 200, type: DashboardResumoDto })
  findMonthly(@Query('mes') mes?: string): Promise<DashboardResumoDto> {
    return this.obterResumoMensal.execute(mes);
  }
}
