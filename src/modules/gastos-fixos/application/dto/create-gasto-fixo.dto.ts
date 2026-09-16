import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

// Antes desta correção, este DTO não tinha nenhum decorator de
// class-validator — com `ValidationPipe({ whitelist: true })` (main.ts),
// isso descartava silenciosamente `nome`/`valor` do payload antes de chegar
// no service, quebrando POST /gastos-fixos.
export class CreateGastoFixoDto {
  @IsString()
  @ApiProperty({ example: 'Aluguel' })
  nome!: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 1200.0 })
  valor!: number;
}
