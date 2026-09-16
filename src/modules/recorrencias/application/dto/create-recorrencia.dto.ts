import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
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
} from '../../../transacoes/domain/transacao.constants';

// Antes desta correção, este DTO só tinha decorators @ApiProperty (Swagger),
// sem nenhum @Is*/class-validator — com `ValidationPipe({ whitelist: true })`
// (main.ts) isso descartava silenciosamente todos os campos do payload.
export class CreateRecorrenciaDto {
  @IsString()
  @ApiProperty({ example: 'Aluguel' })
  compra!: string;

  @IsEnum(TRANSACAO_ACOES)
  @ApiProperty({ enum: TRANSACAO_ACOES })
  acao!: string;

  @IsString()
  @ApiProperty({ example: 'Moradia' })
  classificacao_1!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Aluguel mensal', default: null })
  classificacao_2?: string;

  @IsEnum(TRANSACAO_TIPOS)
  @ApiProperty({ enum: TRANSACAO_TIPOS })
  tipo!: string;

  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1 })
  parcelamento!: number;

  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1 })
  parcela!: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Imobiliária XPTO' })
  local?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({
    example: 1200.0,
    description:
      'Quando definido junto de cartaoPadrao, habilita a geração automática mensal desta recorrência',
  })
  valorPadrao?: number;

  @IsOptional()
  @IsEnum(TRANSACAO_CARTOES)
  @ApiPropertyOptional({ enum: TRANSACAO_CARTOES })
  cartaoPadrao?: string;
}
