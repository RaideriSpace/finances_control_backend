import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SaldoResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() fonte!: string;
  @ApiProperty() valor!: number;
  @ApiPropertyOptional({ nullable: true }) mes!: string | null;
}
