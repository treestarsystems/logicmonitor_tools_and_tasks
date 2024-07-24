import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageServiceMongoDB } from './storage-mongodb.service';
import { BackupLMData, BackupSchema } from 'src/storage/schemas/storage.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BackupLMData.name, schema: BackupSchema },
    ]),
  ],
  providers: [StorageServiceMongoDB],
})
export class StorageModule {}
