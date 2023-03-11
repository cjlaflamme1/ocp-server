import { Test, TestingModule } from '@nestjs/testing';
import { GroupInvitationController } from './group-invitation.controller';
import { GroupInvitationService } from './group-invitation.service';

describe('GroupInvitationController', () => {
  let controller: GroupInvitationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupInvitationController],
      providers: [GroupInvitationService],
    }).compile();

    controller = module.get<GroupInvitationController>(GroupInvitationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
