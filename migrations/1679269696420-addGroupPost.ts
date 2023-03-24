import { MigrationInterface, QueryRunner } from "typeorm";

export class addGroupPost1679269696420 implements MigrationInterface {
    name = 'addGroupPost1679269696420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`group_post\` (\`id\` varchar(36) NOT NULL, \`image\` varchar(255) NULL, \`postText\` longtext NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`groupId\` varchar(36) NULL, \`authorId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`group_post\` ADD CONSTRAINT \`FK_b4aa5bdc9931dee5d5bd28cc719\` FOREIGN KEY (\`groupId\`) REFERENCES \`group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`group_post\` ADD CONSTRAINT \`FK_3cdcc2478ff742828790826b836\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`group_post\` DROP FOREIGN KEY \`FK_3cdcc2478ff742828790826b836\``);
        await queryRunner.query(`ALTER TABLE \`group_post\` DROP FOREIGN KEY \`FK_b4aa5bdc9931dee5d5bd28cc719\``);
        await queryRunner.query(`DROP TABLE \`group_post\``);
    }

}
