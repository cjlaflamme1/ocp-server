import { MigrationInterface, QueryRunner } from "typeorm";

export class addGroupEventImage1684611329736 implements MigrationInterface {
    name = 'addGroupEventImage1684611329736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`group_event\` ADD \`coverPhoto\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`group_event\` DROP COLUMN \`coverPhoto\``);
    }

}
