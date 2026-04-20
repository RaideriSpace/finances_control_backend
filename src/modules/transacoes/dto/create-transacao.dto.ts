import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransacaoDto {
  @ApiProperty({ example: 'Pães e Frios' })
  compra!: string;

  @ApiProperty({ example: 'Ifood - Padaria do Bairro' })
  estabelecimento?: string;

  @ApiProperty({ example: 'IFOOD' })
  razao_social!: string;

  @ApiProperty({
    enum: ['pagamento', 'transferência', 'depósito', 'investimento', 'saque'],
  })
  acao!: string;

  @ApiProperty()
  tipo_1!: string;

  @ApiPropertyOptional({ default: null })
  tipo_2?: string;

  @ApiProperty()
  classificacao!: string;

  @ApiProperty({
    enum: ['picpay', 'nubank', 'inter', 'mercado_pago', 'amazon', 'outro'],
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

  @ApiProperty({ example: '2026-04-20' })
  data_fim!: Date;
}
