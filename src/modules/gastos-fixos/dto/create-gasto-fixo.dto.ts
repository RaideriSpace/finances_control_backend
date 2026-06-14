import { ApiProperty } from '@nestjs/swagger';

export class CreateGastoFixoDto {
  @ApiProperty({ example: 'Aluguel' })
  nome!: string;

  @ApiProperty({ example: 1200.0 })
  valor!: number;
}
