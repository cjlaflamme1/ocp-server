import { MigrationInterface, QueryRunner } from "typeorm";

export class addGroupEvent1683065548929 implements MigrationInterface {
    name = 'addGroupEvent1683065548929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`group_event\` (\`id\` varchar(36) NOT NULL, \`eventDate\` datetime NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`creatorId\` varchar(36) NULL, \`groupId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_group_events_group_event\` (\`userId\` varchar(36) NOT NULL, \`groupEventId\` varchar(36) NOT NULL, INDEX \`IDX_816a72a11e4bfadf26926bb1a7\` (\`userId\`), INDEX \`IDX_bf36ba5bdc1309ba353ef0c4a5\` (\`groupEventId\`), PRIMARY KEY (\`userId\`, \`groupEventId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`group_event\` ADD CONSTRAINT \`FK_992e2f82700005cdd43f2f903cc\` FOREIGN KEY (\`creatorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`group_event\` ADD CONSTRAINT \`FK_457a31dfa3e8544d11631ba6a90\` FOREIGN KEY (\`groupId\`) REFERENCES \`group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_group_events_group_event\` ADD CONSTRAINT \`FK_816a72a11e4bfadf26926bb1a71\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_group_events_group_event\` ADD CONSTRAINT \`FK_bf36ba5bdc1309ba353ef0c4a5d\` FOREIGN KEY (\`groupEventId\`) REFERENCES \`group_event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_group_events_group_event\` DROP FOREIGN KEY \`FK_bf36ba5bdc1309ba353ef0c4a5d\``);
        await queryRunner.query(`ALTER TABLE \`user_group_events_group_event\` DROP FOREIGN KEY \`FK_816a72a11e4bfadf26926bb1a71\``);
        await queryRunner.query(`ALTER TABLE \`group_event\` DROP FOREIGN KEY \`FK_457a31dfa3e8544d11631ba6a90\``);
        await queryRunner.query(`ALTER TABLE \`group_event\` DROP FOREIGN KEY \`FK_992e2f82700005cdd43f2f903cc\``);
        await queryRunner.query(`DROP INDEX \`IDX_bf36ba5bdc1309ba353ef0c4a5\` ON \`user_group_events_group_event\``);
        await queryRunner.query(`DROP INDEX \`IDX_816a72a11e4bfadf26926bb1a7\` ON \`user_group_events_group_event\``);
        await queryRunner.query(`DROP TABLE \`user_group_events_group_event\``);
        await queryRunner.query(`DROP TABLE \`group_event\``);
    }

}
