import { Test, TestingModule } from '@nestjs/testing';
import { GroupInvitationService } from './group-invitation.service';

describe('GroupInvitationService', () => {
  let service: GroupInvitationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupInvitationService],
    }).compile();

    service = module.get<GroupInvitationService>(GroupInvitationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
