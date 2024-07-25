import { Test, TestingModule } from '@nestjs/testing';
import { StorageServiceMongoDB } from '../src/storage/storage-mongodb.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BackupLMData,
  BackupSchema,
} from '../src/storage/schemas/storage-mongodb.schema';

describe('MongodbStorageService', () => {
  let service: StorageServiceMongoDB;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([
          { name: BackupLMData.name, schema: BackupSchema },
        ]),
      ],
      providers: [StorageServiceMongoDB],
    }).compile();

    service = module.get<StorageServiceMongoDB>(StorageServiceMongoDB);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
