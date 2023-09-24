import { MigrationInterface, QueryRunner } from "typeorm";

export class addLongerTexts1695514396573 implements MigrationInterface {
    name = 'addLongerTexts1695514396573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_activity\` DROP COLUMN \`information\``);
        await queryRunner.query(`ALTER TABLE \`users_activity\` ADD \`information\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` DROP COLUMN \`favoriteLocations\``);
        await queryRunner.query(`ALTER TABLE \`users_activity\` ADD \`favoriteLocations\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` DROP COLUMN \`preferredGroupDetails\``);
        await queryRunner.query(`ALTER TABLE \`users_activity\` ADD \`preferredGroupDetails\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` DROP COLUMN \`mentorNeedsDetails\``);
        await queryRunner.query(`ALTER TABLE \`users_activity\` ADD \`mentorNeedsDetails\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` DROP COLUMN \`provideMentorshipDetails\``);
        await queryRunner.query(`ALTER TABLE \`users_activity\` ADD \`provideMentorshipDetails\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`group_event\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`group_event\` ADD \`description\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`group\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`group\` ADD \`description\` longtext NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`group_invitation\` DROP COLUMN \`message\``);
        await queryRunner.query(`ALTER TABLE \`group_invitation\` ADD \`message\` longtext NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`group_invitation\` DROP COLUMN \`message\``);
        await queryRunner.query(`ALTER TABLE \`group_invitation\` ADD \`message\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`group\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`group\` ADD \`description\` mediumtext NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`group_event\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`group_event\` ADD \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` DROP COLUMN \`provideMentorshipDetails\``);
        await queryRunner.query(`ALTER TABLE \`users_activity\` ADD \`provideMentorshipDetails\` mediumtext NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` DROP COLUMN \`mentorNeedsDetails\``);
        await queryRunner.query(`ALTER TABLE \`users_activity\` ADD \`mentorNeedsDetails\` mediumtext NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` DROP COLUMN \`preferredGroupDetails\``);
        await queryRunner.query(`ALTER TABLE \`users_activity\` ADD \`preferredGroupDetails\` mediumtext NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` DROP COLUMN \`favoriteLocations\``);
        await queryRunner.query(`ALTER TABLE \`users_activity\` ADD \`favoriteLocations\` mediumtext NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` DROP COLUMN \`information\``);
        await queryRunner.query(`ALTER TABLE \`users_activity\` ADD \`information\` mediumtext NULL`);
    }

}
