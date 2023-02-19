import { Test, TestingModule } from '@nestjs/testing';
import { LosenordService } from './losenord.service';

describe('LosenordService', () => {
  let service: LosenordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LosenordService],
    }).compile();

    service = module.get<LosenordService>(LosenordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
