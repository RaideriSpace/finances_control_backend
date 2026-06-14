import { PartialType } from '@nestjs/swagger';
import { CreateSaldoDto } from './create-saldo.dto';

export class UpdateSaldoDto extends PartialType(CreateSaldoDto) {}
