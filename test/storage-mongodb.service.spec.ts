import { Test, TestingModule } from '@nestjs/testing';
import { StorageServiceMongoDB } from '../src/storage/storage-mongodb.service';

describe('MongodbStorageService', () => {
  let service: StorageServiceMongoDB;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageServiceMongoDB],
    }).compile();

    service = module.get<StorageServiceMongoDB>(StorageServiceMongoDB);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
