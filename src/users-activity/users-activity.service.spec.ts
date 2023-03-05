import { Test, TestingModule } from '@nestjs/testing';
import { UsersActivityService } from './users-activity.service';

describe('UsersActivityService', () => {
  let service: UsersActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersActivityService],
    }).compile();

    service = module.get<UsersActivityService>(UsersActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
