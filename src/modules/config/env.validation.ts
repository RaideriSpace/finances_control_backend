import { plainToInstance } from 'class-transformer';
import {
  IsBooleanString,
  IsNotEmpty,
  IsOptional,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsNotEmpty({ message: 'DB_HOST é obrigatório' })
  DB_HOST!: string;

  @IsOptional()
  DB_PORT?: string;

  @IsNotEmpty({ message: 'DB_USER é obrigatório' })
  DB_USER!: string;

  @IsNotEmpty({ message: 'DB_PASSWORD é obrigatório' })
  DB_PASSWORD!: string;

  @IsNotEmpty({ message: 'DB_NAME é obrigatório' })
  DB_NAME!: string;

  @IsOptional()
  @IsBooleanString()
  DB_SSL_REJECT_UNAUTHORIZED?: string;

  @IsOptional()
  ALLOWED_ORIGINS?: string;

  @IsOptional()
  PORT?: string;
}

/**
 * Falha rápido no boot se variáveis de ambiente obrigatórias faltarem,
 * em vez de deixar a conexão com o Postgres falhar silenciosamente depois.
 */
export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const details = errors
      .map((error) => Object.values(error.constraints ?? {}).join(', '))
      .join('; ');
    throw new Error(`Configuração de ambiente inválida: ${details}`);
  }

  return validatedConfig;
}
