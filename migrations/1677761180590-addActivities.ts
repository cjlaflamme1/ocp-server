import { MigrationInterface, QueryRunner } from "typeorm";

export class addActivities1677761180590 implements MigrationInterface {
    name = 'addActivities1677761180590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`activity_type\` (\`id\` varchar(36) NOT NULL, \`activityTitle\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_ddc84a766ed419cac469626ad5\` (\`activityTitle\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users_activity\` (\`id\` varchar(36) NOT NULL, \`information\` mediumtext NULL, \`favoriteLocations\` mediumtext NULL, \`yearsParticipating\` varchar(255) NULL, \`preferredGroupDetails\` mediumtext NULL, \`seekingMentor\` tinyint NOT NULL DEFAULT 0, \`mentorNeedsDetails\` mediumtext NULL, \`offeringMentorship\` tinyint NOT NULL DEFAULT 0, \`provideMentorshipDetails\` mediumtext NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`activityTypeId\` varchar(36) NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` ADD CONSTRAINT \`FK_75a32614847ff0d919af74ed9b7\` FOREIGN KEY (\`activityTypeId\`) REFERENCES \`activity_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_activity\` ADD CONSTRAINT \`FK_28b7fa753e5c9aec4f0b55051cc\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_activity\` DROP FOREIGN KEY \`FK_28b7fa753e5c9aec4f0b55051cc\``);
        await queryRunner.query(`ALTER TABLE \`users_activity\` DROP FOREIGN KEY \`FK_75a32614847ff0d919af74ed9b7\``);
        await queryRunner.query(`DROP TABLE \`users_activity\``);
        await queryRunner.query(`DROP INDEX \`IDX_ddc84a766ed419cac469626ad5\` ON \`activity_type\``);
        await queryRunner.query(`DROP TABLE \`activity_type\``);
    }

}
