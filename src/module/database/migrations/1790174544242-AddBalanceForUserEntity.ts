import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBalanceForUserEntity1790174544242 implements MigrationInterface {
    name = 'AddBalanceForUserEntity1790174544242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_207dec28c1b5028d8658d9a6f1"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "balance" character varying NOT NULL DEFAULT '0'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."balance" IS 'Баланс'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."isDeleted" IS 'Был ли удален аккаунт'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phone" character varying(10) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."phone" IS 'Номер телефона пользователя'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a62473490b3e4578fd683235c5"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "login"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "login" character varying NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."login" IS 'Логин пользователя'`);
        await queryRunner.query(`CREATE INDEX "IDX_a62473490b3e4578fd683235c5" ON "user"  ("login") `);
        await queryRunner.query(`CREATE INDEX "IDX_879e6347c8b70d3698eeefee76" ON "user"  ("user_id", "phone") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_879e6347c8b70d3698eeefee76"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a62473490b3e4578fd683235c5"`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."login" IS 'Логин пользователя'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "login"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "login" character varying(20) NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_a62473490b3e4578fd683235c5" ON "user" USING btree ("login") `);
        await queryRunner.query(`COMMENT ON COLUMN "user"."phone" IS 'Номер телефона пользователя'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phone" character varying(20) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."isDeleted" IS 'Был ли удален аккаунт'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isDeleted"`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."balance" IS 'Баланс'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "balance"`);
        await queryRunner.query(`CREATE INDEX "IDX_207dec28c1b5028d8658d9a6f1" ON "user" USING btree ("login", "phone") `);
    }

}
