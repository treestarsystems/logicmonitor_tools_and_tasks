import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageServiceMongoDB } from './storage-mongodb.service';
import { StorageServiceZip } from './storage-zip.service';
import { BackupLMData, BackupSchema } from './schemas/storage-mongodb.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BackupLMData.name, schema: BackupSchema },
    ]),
  ],
  providers: [StorageServiceMongoDB, StorageServiceZip],
})
export class StorageModule {}
