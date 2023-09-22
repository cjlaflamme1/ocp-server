import { MigrationInterface, QueryRunner } from "typeorm";

export class addResetRequest1695383970524 implements MigrationInterface {
    name = 'addResetRequest1695383970524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`reset_request\` (\`id\` varchar(36) NOT NULL, \`resetToken\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`reset_request\` ADD CONSTRAINT \`FK_b707eddd2f0daeec3b3c7daba48\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reset_request\` DROP FOREIGN KEY \`FK_b707eddd2f0daeec3b3c7daba48\``);
        await queryRunner.query(`DROP TABLE \`reset_request\``);
    }

}
