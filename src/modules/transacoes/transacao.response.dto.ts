import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  TRANSACAO_ACOES,
  TRANSACAO_CARTOES,
  TRANSACAO_TIPOS,
} from './domain/transacao.constants';

/**
 * Forma pública da transação — o que o controller de fato retorna,
 * desacoplado da entidade de persistência (`infrastructure/transacao.orm-entity.ts`).
 */
export class TransacaoResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() compra!: string;
  @ApiProperty({ enum: TRANSACAO_ACOES }) acao!: string;
  @ApiProperty() classificacao_1!: string;
  @ApiPropertyOptional({ nullable: true }) classificacao_2!: string | null;
  @ApiProperty({ enum: TRANSACAO_CARTOES }) cartao!: string;
  @ApiPropertyOptional({ nullable: true, enum: TRANSACAO_CARTOES })
  cartaoDestino!: string | null;
  @ApiProperty({ enum: TRANSACAO_TIPOS }) tipo!: string;
  @ApiProperty() parcelamento!: number;
  @ApiProperty() parcela!: number;
  @ApiProperty() valor!: number;
  @ApiProperty() data_inicio!: string;
  @ApiProperty() data_fim!: string;
  @ApiPropertyOptional({ nullable: true }) local!: string | null;
  @ApiPropertyOptional({ nullable: true }) data_pagamento!: string | null;
  @ApiPropertyOptional({ nullable: true }) recorrenciaId!: string | null;
}
