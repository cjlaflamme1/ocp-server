import { MigrationInterface, QueryRunner } from "typeorm";

export class addNotificationInvite1692482261211 implements MigrationInterface {
    name = 'addNotificationInvite1692482261211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` ADD \`invite\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` DROP COLUMN \`invite\``);
    }

}
