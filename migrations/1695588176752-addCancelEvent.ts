import { MigrationInterface, QueryRunner } from "typeorm";

export class addCancelEvent1695588176752 implements MigrationInterface {
    name = 'addCancelEvent1695588176752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`group_event\` ADD \`cancelled\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`group_event\` DROP COLUMN \`cancelled\``);
    }

}
