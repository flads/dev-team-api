import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLevelsTable1672106922249 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE levels (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "levels"`);
  }
}
