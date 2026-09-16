import { ApiProperty } from '@nestjs/swagger';

export class GastoFixoResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() nome!: string;
  @ApiProperty() valor!: number;
}
