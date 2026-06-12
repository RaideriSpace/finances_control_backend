import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransacaoDto {
  @ApiProperty({ example: 'Pães e Frios' })
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

  @ApiProperty({ example: 'Alimentação' })
  classificacao_1!: string;

  @ApiPropertyOptional({ example: 'Delivery', default: null })
  classificacao_2?: string;

  @ApiProperty({
    enum: [
      'picpay',
      'swile',
      'nubank',
      'inter',
      'mercado_pago',
      'amazon',
      'outro',
    ],
  })
  cartao!: string;

  @ApiProperty({ enum: ['credito', 'debito'] })
  tipo!: string;

  @ApiProperty({ example: 1 })
  parcelamento!: number;

  @ApiProperty({ example: 1 })
  parcela!: number;

  @ApiProperty({ example: 55.9 })
  valor!: number;

  @ApiProperty({ example: '2026-04-20' })
  data_inicio!: Date;

  @ApiProperty({ example: '2026-05-20' })
  data_fim!: Date;

  @ApiPropertyOptional({ example: 'Ifood - Padaria do Bairro' })
  local?: string;

  @ApiPropertyOptional({ example: '2026-04-20' })
  data_pagamento?: string;
}
