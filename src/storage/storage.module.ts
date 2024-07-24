import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageService } from './storage.service';
import { BackupLMData, BackupSchema } from 'src/storage/schemas/storage.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BackupLMData.name, schema: BackupSchema },
    ]),
  ],
  providers: [StorageService],
})
export class StorageModule {}
