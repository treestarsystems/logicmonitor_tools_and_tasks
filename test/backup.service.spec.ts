import { Test, TestingModule } from '@nestjs/testing';
import { BackupService } from '../src/tools/tools-backup-datasources.service';

describe('BackupService', () => {
  let service: BackupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BackupService],
    }).compile();

    service = module.get<BackupService>(BackupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
