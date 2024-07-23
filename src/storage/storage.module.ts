import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageService } from './storage.service';
import { Backup, BackupSchema } from 'src/storage/schemas/storage.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Backup.name, schema: BackupSchema }]),
  ],
  providers: [StorageService],
})
export class StorageModule {}
