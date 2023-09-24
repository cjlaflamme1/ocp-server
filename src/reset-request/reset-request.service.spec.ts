import { Test, TestingModule } from '@nestjs/testing';
import { ResetRequestService } from './reset-request.service';

describe('ResetRequestService', () => {
  let service: ResetRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResetRequestService],
    }).compile();

    service = module.get<ResetRequestService>(ResetRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
