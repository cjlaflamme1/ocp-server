import { Test, TestingModule } from '@nestjs/testing';
import { DbQueryService } from './db-query.service';

describe('DbQueryService', () => {
  let service: DbQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbQueryService],
    }).compile();

    service = module.get<DbQueryService>(DbQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
