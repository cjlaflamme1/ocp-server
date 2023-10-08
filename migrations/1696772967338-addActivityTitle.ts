import { MigrationInterface, QueryRunner } from "typeorm";

export class addActivityTitle1696772967338 implements MigrationInterface {
    name = 'addActivityTitle1696772967338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_activity\` DROP FOREIGN KEY \`FK_75a32614847ff0d919af74ed9b7\``);
        await queryRunner.query(`ALTER TABLE \`users_activity\` CHANGE \`activityTypeId\` \`activityName\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` DROP COLUMN \`activityName\``);
        await queryRunner.query(`ALTER TABLE \`users_activity\` ADD \`activityName\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_activity\` DROP COLUMN \`activityName\``);
        await queryRunner.query(`ALTER TABLE \`users_activity\` ADD \`activityName\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` CHANGE \`activityName\` \`activityTypeId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` ADD CONSTRAINT \`FK_75a32614847ff0d919af74ed9b7\` FOREIGN KEY (\`activityTypeId\`) REFERENCES \`activity_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
