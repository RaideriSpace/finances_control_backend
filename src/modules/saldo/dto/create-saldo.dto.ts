import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSaldoDto {
  @ApiProperty({ example: 'uliving' })
  fonte!: string;

  @ApiPropertyOptional({ example: 3500.0 })
  valor?: number;

  @ApiPropertyOptional({
    example: '2026-06-01',
    description: 'Mês de referência (sempre o dia 1 do mês)',
  })
  mes?: string;
}
