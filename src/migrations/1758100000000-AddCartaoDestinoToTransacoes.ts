import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Suporte a transferências entre contas: `cartao` passa a ser a conta de
 * origem e `cartao_destino` (nova, nullable) a conta de destino — só
 * preenchida quando `acao = 'transferência'`.
 */
export class AddCartaoDestinoToTransacoes1758100000000 implements MigrationInterface {
  name = 'AddCartaoDestinoToTransacoes1758100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "transacoes"
      ADD COLUMN IF NOT EXISTS "cartao_destino" "cartao_enum" NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transacoes" DROP COLUMN IF EXISTS "cartao_destino"`,
    );
  }
}
