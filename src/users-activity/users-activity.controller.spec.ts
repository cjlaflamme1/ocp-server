import { Test, TestingModule } from '@nestjs/testing';
import { UsersActivityController } from './users-activity.controller';
import { UsersActivityService } from './users-activity.service';

describe('UsersActivityController', () => {
  let controller: UsersActivityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersActivityController],
      providers: [UsersActivityService],
    }).compile();

    controller = module.get<UsersActivityController>(UsersActivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
