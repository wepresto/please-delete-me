import { MigrationInterface, QueryRunner } from 'typeorm';

export class createLenderTable1678762822330 implements MigrationInterface {
  name = 'createLenderTable1678762822330';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lender" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "uk_lender_uid" UNIQUE ("uuid"), CONSTRAINT "REL_acab8a2ccacc07f7dabc9c3747" UNIQUE ("user_id"), CONSTRAINT "PK_8cb68b42ba3dd99084822711855" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "lender" ADD CONSTRAINT "FK_acab8a2ccacc07f7dabc9c3747b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lender" DROP CONSTRAINT "FK_acab8a2ccacc07f7dabc9c3747b"`,
    );
    await queryRunner.query(`DROP TABLE "lender"`);
  }
}
