import { MigrationInterface, QueryRunner } from "typeorm";

export class MODIFYLongerTexts1695514396573 implements MigrationInterface {
    name = 'MODIFYLongerTexts1695514396573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_activity\` MODIFY \`information\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` MODIFY \`favoriteLocations\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` MODIFY \`preferredGroupDetails\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` MODIFY \`mentorNeedsDetails\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` MODIFY \`provideMentorshipDetails\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`group_event\` MODIFY \`description\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`group\` MODIFY \`description\` longtext NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`group_invitation\` MODIFY \`message\` longtext NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`group_invitation\` MODIFY \`message\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`group\` MODIFY \`description\` mediumtext NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`group_event\` MODIFY \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` MODIFY \`provideMentorshipDetails\` mediumtext NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` MODIFY \`mentorNeedsDetails\` mediumtext NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` MODIFY \`preferredGroupDetails\` mediumtext NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` MODIFY \`favoriteLocations\` mediumtext NULL`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` MODIFY \`information\` mediumtext NULL`);
    }

}
