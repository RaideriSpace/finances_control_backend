import { PartialType } from '@nestjs/swagger';
import { CreateGastoFixoDto } from './create-gasto-fixo.dto';

export class UpdateGastoFixoDto extends PartialType(CreateGastoFixoDto) {}
