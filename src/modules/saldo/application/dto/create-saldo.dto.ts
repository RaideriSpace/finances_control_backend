import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateSaldoDto {
  @IsString()
  @ApiProperty({ example: 'uliving' })
  fonte!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ example: 3500.0 })
  valor?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: '2026-06-01',
    description: 'Mês de referência (sempre o dia 1 do mês)',
  })
  mes?: string;
}
