import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Primeira migration do projeto (schema era gerenciado manualmente até aqui).
 * Adiciona apenas colunas novas e nullable — nenhuma coluna/tabela existente
 * é alterada ou removida.
 */
export class AddGeracaoAutomaticaRecorrencias1758000000000 implements MigrationInterface {
  name = 'AddGeracaoAutomaticaRecorrencias1758000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transacoes" ADD COLUMN IF NOT EXISTS "recorrencia_id" uuid NULL`,
    );

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "recorrencias_cartao_padrao_enum" AS ENUM (
          'picpay','swile','nubank','inter','mercado_pago','amazon','outro'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);
    await queryRunner.query(
      `ALTER TABLE "recorrencias" ADD COLUMN IF NOT EXISTS "valor_padrao" double precision NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "recorrencias" ADD COLUMN IF NOT EXISTS "cartao_padrao" "recorrencias_cartao_padrao_enum" NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "recorrencias" ADD COLUMN IF NOT EXISTS "ultima_geracao" date NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "recorrencias" DROP COLUMN IF EXISTS "ultima_geracao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recorrencias" DROP COLUMN IF EXISTS "cartao_padrao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recorrencias" DROP COLUMN IF EXISTS "valor_padrao"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "recorrencias_cartao_padrao_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transacoes" DROP COLUMN IF EXISTS "recorrencia_id"`,
    );
  }
}
