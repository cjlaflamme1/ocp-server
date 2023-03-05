import { MigrationInterface, QueryRunner } from "typeorm";

export class addActivitiesCoverImage1677966622567 implements MigrationInterface {
    name = 'addActivitiesCoverImage1677966622567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_activity\` ADD \`coverPhoto\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_activity\` DROP COLUMN \`coverPhoto\``);
    }

}
