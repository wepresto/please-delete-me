import { MigrationInterface, QueryRunner } from 'typeorm';

export class createInversionistTable1678667284168
  implements MigrationInterface
{
  name = 'createInversionistTable1678667284168';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "inversionist" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "uk_inversionist_uid" UNIQUE ("uuid"), CONSTRAINT "REL_ad0f726fda1b33ed516f29af2f" UNIQUE ("user_id"), CONSTRAINT "PK_77af82bf3f70c5f412942df0c5b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "inversionist" ADD CONSTRAINT "FK_ad0f726fda1b33ed516f29af2f0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inversionist" DROP CONSTRAINT "FK_ad0f726fda1b33ed516f29af2f0"`,
    );
    await queryRunner.query(`DROP TABLE "inversionist"`);
  }
}
