import { MigrationInterface, QueryRunner } from "typeorm";

export class addGroupEventResponses1690040294724 implements MigrationInterface {
    name = 'addGroupEventResponses1690040294724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`response\` ADD \`groupEventId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`response\` ADD CONSTRAINT \`FK_ae957c99184d802b09f3a42218f\` FOREIGN KEY (\`groupEventId\`) REFERENCES \`group_event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`response\` DROP FOREIGN KEY \`FK_ae957c99184d802b09f3a42218f\``);
        await queryRunner.query(`ALTER TABLE \`response\` DROP COLUMN \`groupEventId\``);
    }

}
