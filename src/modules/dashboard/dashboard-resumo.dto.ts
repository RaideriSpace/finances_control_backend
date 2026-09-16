import { ApiProperty } from '@nestjs/swagger';
import { TransacaoResponseDto } from '../transacoes/transacao.response.dto';

class CategoriaResumoDto {
  @ApiProperty() nome!: string;
  @ApiProperty() valor!: number;
}

export class DashboardResumoDto {
  @ApiProperty() mes!: string;
  @ApiProperty() disponivel!: number;
  @ApiProperty() devido!: number;
  @ApiProperty() totalGasto!: number;
  @ApiProperty({ type: [CategoriaResumoDto] })
  categorias!: CategoriaResumoDto[];
  @ApiProperty({ type: [TransacaoResponseDto] })
  ultimosLancamentos!: TransacaoResponseDto[];
}
