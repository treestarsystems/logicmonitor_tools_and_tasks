import { Test, TestingModule } from '@nestjs/testing';
import { StorageModelsService } from '../storage-models.service';

describe('StorageModelsService', () => {
  let service: StorageModelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageModelsService],
    }).compile();

    service = module.get<StorageModelsService>(StorageModelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
