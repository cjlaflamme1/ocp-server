import { MigrationInterface, QueryRunner } from "typeorm";

export class addGroupLocation1696685896652 implements MigrationInterface {
    name = 'addGroupLocation1696685896652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`group\` ADD \`location\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`group\` DROP COLUMN \`location\``);
    }

}
