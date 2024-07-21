import { Test, TestingModule } from '@nestjs/testing';
import { MongodbStorageService } from '../src/storage/mongodb-storage.service';

describe('MongodbStorageService', () => {
  let service: MongodbStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongodbStorageService],
    }).compile();

    service = module.get<MongodbStorageService>(MongodbStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
