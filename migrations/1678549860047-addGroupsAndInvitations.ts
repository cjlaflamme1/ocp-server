import { MigrationInterface, QueryRunner } from "typeorm";

export class addGroupsAndInvitations1678549860047 implements MigrationInterface {
    name = 'addGroupsAndInvitations1678549860047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`group\` (\`id\` varchar(36) NOT NULL, \`coverPhoto\` varchar(255) NULL, \`title\` varchar(255) NOT NULL, \`description\` mediumtext NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`group_invitation\` (\`id\` varchar(36) NOT NULL, \`accepted\` tinyint NULL, \`message\` varchar(255) NULL, \`viewed\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`invitedUserId\` varchar(36) NULL, \`groupId\` varchar(36) NULL, \`invitedById\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_admin_for_groups_group\` (\`userId\` varchar(36) NOT NULL, \`groupId\` varchar(36) NOT NULL, INDEX \`IDX_ce923f67a9f3e3f7758b17d4cf\` (\`userId\`), INDEX \`IDX_20fd207cd44cb971a048d72d12\` (\`groupId\`), PRIMARY KEY (\`userId\`, \`groupId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`group_invitation\` ADD CONSTRAINT \`FK_50732baa2649c4faaadac8e53ae\` FOREIGN KEY (\`invitedUserId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`group_invitation\` ADD CONSTRAINT \`FK_5bc81ed8db5ea55003455aed33f\` FOREIGN KEY (\`groupId\`) REFERENCES \`group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`group_invitation\` ADD CONSTRAINT \`FK_505d5da660478bd66400cb14e09\` FOREIGN KEY (\`invitedById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_admin_for_groups_group\` ADD CONSTRAINT \`FK_ce923f67a9f3e3f7758b17d4cf7\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_admin_for_groups_group\` ADD CONSTRAINT \`FK_20fd207cd44cb971a048d72d124\` FOREIGN KEY (\`groupId\`) REFERENCES \`group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_admin_for_groups_group\` DROP FOREIGN KEY \`FK_20fd207cd44cb971a048d72d124\``);
        await queryRunner.query(`ALTER TABLE \`user_admin_for_groups_group\` DROP FOREIGN KEY \`FK_ce923f67a9f3e3f7758b17d4cf7\``);
        await queryRunner.query(`ALTER TABLE \`group_invitation\` DROP FOREIGN KEY \`FK_505d5da660478bd66400cb14e09\``);
        await queryRunner.query(`ALTER TABLE \`group_invitation\` DROP FOREIGN KEY \`FK_5bc81ed8db5ea55003455aed33f\``);
        await queryRunner.query(`ALTER TABLE \`group_invitation\` DROP FOREIGN KEY \`FK_50732baa2649c4faaadac8e53ae\``);
        await queryRunner.query(`DROP INDEX \`IDX_20fd207cd44cb971a048d72d12\` ON \`user_admin_for_groups_group\``);
        await queryRunner.query(`DROP INDEX \`IDX_ce923f67a9f3e3f7758b17d4cf\` ON \`user_admin_for_groups_group\``);
        await queryRunner.query(`DROP TABLE \`user_admin_for_groups_group\``);
        await queryRunner.query(`DROP TABLE \`group_invitation\``);
        await queryRunner.query(`DROP TABLE \`group\``);
    }

}
