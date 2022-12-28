import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1672106930524 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            level_id INT NOT NULL,
            gender VARCHAR(50),
            birthdate TIMESTAMP,
            hobby VARCHAR(255),
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP NOT NULL,
            CONSTRAINT fk_level FOREIGN KEY(level_id) REFERENCES levels(id)
        );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
