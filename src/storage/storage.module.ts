import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodbStorageService } from './mongodb-storage.service';
import { BackupSchema, BackupLMData } from './storage.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BackupLMData.name, schema: BackupSchema },
    ]),
  ],
  providers: [MongodbStorageService],
})
export class StorageModule {}
