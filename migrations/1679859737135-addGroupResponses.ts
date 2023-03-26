import { MigrationInterface, QueryRunner } from "typeorm";

export class addGroupResponses1679859737135 implements MigrationInterface {
    name = 'addGroupResponses1679859737135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`response\` (\`id\` varchar(36) NOT NULL, \`responseText\` longtext NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`authorId\` varchar(36) NULL, \`groupPostId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`response\` ADD CONSTRAINT \`FK_59b3b84791006e451ee5806ae7e\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`response\` ADD CONSTRAINT \`FK_9a8b3e38d3823895dd629ff8e17\` FOREIGN KEY (\`groupPostId\`) REFERENCES \`group_post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`response\` DROP FOREIGN KEY \`FK_9a8b3e38d3823895dd629ff8e17\``);
        await queryRunner.query(`ALTER TABLE \`response\` DROP FOREIGN KEY \`FK_59b3b84791006e451ee5806ae7e\``);
        await queryRunner.query(`DROP TABLE \`response\``);
    }

}
