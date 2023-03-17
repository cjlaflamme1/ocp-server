import { MigrationInterface, QueryRunner } from "typeorm";

export class addJointTable1679004653848 implements MigrationInterface {
    name = 'addJointTable1679004653848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_groups_group\` (\`userId\` varchar(36) NOT NULL, \`groupId\` varchar(36) NOT NULL, INDEX \`IDX_84ff6a520aee2bf2512c01cf46\` (\`userId\`), INDEX \`IDX_8abdfe8f9d78a4f5e821dbf620\` (\`groupId\`), PRIMARY KEY (\`userId\`, \`groupId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_groups_group\` ADD CONSTRAINT \`FK_84ff6a520aee2bf2512c01cf462\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_groups_group\` ADD CONSTRAINT \`FK_8abdfe8f9d78a4f5e821dbf6203\` FOREIGN KEY (\`groupId\`) REFERENCES \`group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_groups_group\` DROP FOREIGN KEY \`FK_8abdfe8f9d78a4f5e821dbf6203\``);
        await queryRunner.query(`ALTER TABLE \`user_groups_group\` DROP FOREIGN KEY \`FK_84ff6a520aee2bf2512c01cf462\``);
        await queryRunner.query(`DROP INDEX \`IDX_8abdfe8f9d78a4f5e821dbf620\` ON \`user_groups_group\``);
        await queryRunner.query(`DROP INDEX \`IDX_84ff6a520aee2bf2512c01cf46\` ON \`user_groups_group\``);
        await queryRunner.query(`DROP TABLE \`user_groups_group\``);
    }

}
