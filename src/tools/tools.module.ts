import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';
import { BackupServiceDatasources } from './tools-backup-datasources.service';
import { BackupServiceGeneral } from './tools-backup-general.service';
import { UtilsService } from '../utils/utils.service';
import { StorageServiceMongoDB } from '../storage/storage-mongodb.service';
import { StorageServiceZip } from '../storage/storage-zip.service';
import {
  BackupLMDataDatasource,
  BackupLMDataGeneral,
  BackupSchemaDatasource,
  BackupSchemaGeneral,
} from '../storage/schemas/storage-mongodb.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BackupLMDataDatasource.name, schema: BackupSchemaDatasource },
      { name: BackupLMDataGeneral.name, schema: BackupSchemaGeneral },
    ]),
  ],
  controllers: [ToolsController],
  providers: [
    ToolsService,
    BackupServiceDatasources,
    BackupServiceGeneral,
    UtilsService,
    StorageServiceMongoDB,
    StorageServiceZip,
  ],
})
export class ToolsModule {}
