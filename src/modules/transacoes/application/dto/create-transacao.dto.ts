import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  TRANSACAO_ACOES,
  TRANSACAO_CARTOES,
  TRANSACAO_TIPOS,
} from '../../domain/transacao.constants';

export class CreateTransacaoDto {
  @IsString()
  @ApiProperty({ example: 'Pães e Frios' })
  compra!: string;

  @IsEnum(TRANSACAO_ACOES)
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

  @IsString()
  @ApiProperty({ example: 'Alimentação' })
  classificacao_1!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Delivery', default: null })
  classificacao_2?: string;

  @IsEnum(TRANSACAO_CARTOES)
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

  @IsOptional()
  @IsEnum(TRANSACAO_CARTOES)
  @ApiPropertyOptional({
    enum: TRANSACAO_CARTOES,
    description:
      "Obrigatório e diferente de 'cartao' quando acao === 'transferência'",
  })
  cartaoDestino?: string;

  @IsEnum(TRANSACAO_TIPOS)
  @ApiProperty({ enum: ['credito', 'debito'] })
  tipo!: string;

  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1 })
  parcelamento!: number;

  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1 })
  parcela!: number;

  @IsNumber()
  @ApiProperty({ example: 55.9 })
  valor!: number;

  @IsDateString()
  @ApiProperty({ example: '2026-04-20' })
  data_inicio!: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2026-05-20' })
  data_fim?: string;

  @ApiPropertyOptional({ example: 'Ifood - Padaria do Bairro' })
  @IsOptional()
  @IsString()
  local?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ example: '2026-04-20' })
  data_pagamento?: string;
}
