import { Test, TestingModule } from '@nestjs/testing';
import { StorageServiceZip } from '../src/storage/storage-zip.service';

describe('StorageZipService', () => {
  let service: StorageServiceZip;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageServiceZip],
    }).compile();

    service = module.get<StorageServiceZip>(StorageServiceZip);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
