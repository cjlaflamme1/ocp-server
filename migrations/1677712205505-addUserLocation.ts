import { MigrationInterface, QueryRunner } from "typeorm";

export class addUserLocation1677712205505 implements MigrationInterface {
    name = 'addUserLocation1677712205505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`location\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`location\``);
    }

}
