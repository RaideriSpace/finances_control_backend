import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  TRANSACAO_ACOES,
  TRANSACAO_CARTOES,
  TRANSACAO_TIPOS,
} from '../transacoes/domain/transacao.constants';

export class RecorrenciaResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() compra!: string;
  @ApiProperty({ enum: TRANSACAO_ACOES }) acao!: string;
  @ApiProperty() classificacao_1!: string;
  @ApiPropertyOptional({ nullable: true }) classificacao_2!: string | null;
  @ApiProperty({ enum: TRANSACAO_TIPOS }) tipo!: string;
  @ApiProperty() parcelamento!: number;
  @ApiProperty() parcela!: number;
  @ApiPropertyOptional({ nullable: true }) local!: string | null;
  @ApiPropertyOptional({ nullable: true }) valorPadrao!: number | null;
  @ApiPropertyOptional({ nullable: true, enum: TRANSACAO_CARTOES })
  cartaoPadrao!: string | null;
  @ApiPropertyOptional({ nullable: true }) ultimaGeracao!: string | null;
}
