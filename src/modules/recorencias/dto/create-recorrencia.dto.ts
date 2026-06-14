import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecorrenciaDto {
  @ApiProperty({ example: 'Aluguel' })
  compra!: string;

  @ApiProperty({
    enum: [
      'pagamento',
      'transferência',
      'depósito',
      'investimento',
      'saque',
      'compra',
    ],
  })
  acao!: string;

  @ApiProperty({ example: 'Moradia' })
  classificacao_1!: string;

  @ApiPropertyOptional({ example: 'Aluguel mensal', default: null })
  classificacao_2?: string;

  @ApiProperty({ enum: ['credito', 'debito'] })
  tipo!: string;

  @ApiProperty({ example: 1 })
  parcelamento!: number;

  @ApiProperty({ example: 1 })
  parcela!: number;

  @ApiPropertyOptional({ example: 'Imobiliária XPTO' })
  local?: string;
}
