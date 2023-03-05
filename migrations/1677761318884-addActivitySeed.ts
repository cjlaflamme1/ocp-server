import { CreateActivityTypeDto } from "src/activity-types/dto/create-activity-type.dto"
import { ActivityType } from "src/activity-types/entities/activity-type.entity"
import { MigrationInterface, QueryRunner } from "typeorm"

export class addActivitySeed1677761318884 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const activitySeeds: CreateActivityTypeDto[] = [
            {
                activityTitle: 'Backcountry Skiing',
            },
            {
                activityTitle: 'Trail Running',
            },
            {
                activityTitle: 'Hiking',
            },
            {
                activityTitle: 'Mountain Biking',
            },
            {
                activityTitle: 'Rock Climbing',
            },
            {
                activityTitle: 'Paddling',
            }
        ]
        await Promise.all(
            activitySeeds.map(async (activity) => {
                await queryRunner.manager.save(ActivityType, activity);
            })
        )
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
