import { Module } from '@nestjs/common';
import { MongodbStorageService } from './mongodb-storage.service';

@Module({
  providers: [MongodbStorageService],
})
export class StorageModule {}
