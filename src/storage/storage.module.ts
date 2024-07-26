import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageServiceMongoDB } from './storage-mongodb.service';
import { StorageServiceZip } from './storage-zip.service';
import {
  BackupLMDataDatasource,
  BackupLMDataGeneral,
  BackupSchemaDatasource,
  BackupSchemaGeneral,
} from './schemas/storage-mongodb.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BackupLMDataDatasource.name, schema: BackupSchemaDatasource },
      { name: BackupLMDataGeneral.name, schema: BackupSchemaGeneral },
    ]),
  ],
  providers: [StorageServiceMongoDB, StorageServiceZip],
})
export class StorageModule {}
