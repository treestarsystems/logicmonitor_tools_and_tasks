import { Module } from '@nestjs/common';
import { MongodbStorageService } from './mongodb-storage.service';
import { StorageModelsService } from './storage-models.service';

@Module({
  providers: [MongodbStorageService, StorageModelsService],
})
export class StorageModule {}
