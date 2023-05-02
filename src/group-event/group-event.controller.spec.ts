import { Test, TestingModule } from '@nestjs/testing';
import { GroupEventController } from './group-event.controller';
import { GroupEventService } from './group-event.service';

describe('GroupEventController', () => {
  let controller: GroupEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupEventController],
      providers: [GroupEventService],
    }).compile();

    controller = module.get<GroupEventController>(GroupEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
