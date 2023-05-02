import { Test, TestingModule } from '@nestjs/testing';
import { GroupEventService } from './group-event.service';

describe('GroupEventService', () => {
  let service: GroupEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupEventService],
    }).compile();

    service = module.get<GroupEventService>(GroupEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
