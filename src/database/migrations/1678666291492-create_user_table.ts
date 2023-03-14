import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserTable1678666291492 implements MigrationInterface {
  name = 'createUserTable1678666291492';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "auth_uid" character varying(100), "document_number" character varying(20), "full_name" character varying(160), "email" character varying(100), "phone_number" character varying(13), "address" character varying(100), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uk_user_auth_uid" UNIQUE ("auth_uid"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
