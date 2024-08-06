import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { BackupServiceDatasources } from '../tools/tools-backup-datasources.service';
import { BackupServiceGeneral } from '../tools/tools-backup-general.service';
import { ToolsModule } from '../tools/tools.module';
import { StorageServiceMongoDB } from 'src/storage/storage-mongodb.service';
import { UtilsService } from 'src/utils/utils.service';
import { StorageServiceZip } from '../storage/storage-zip.service';
import {
  BackupLMDataDatasource,
  BackupLMDataGeneral,
  BackupSchemaDatasource,
  BackupSchemaGeneral,
} from '../storage/schemas/storage-mongodb.schema';
@Module({
  providers: [
    TasksService,
    BackupServiceDatasources,
    BackupServiceGeneral,
    UtilsService,
    StorageServiceMongoDB,
    StorageServiceZip,
  ],
  controllers: [TasksController],
  imports: [
    ToolsModule,
    MongooseModule.forFeature([
      { name: BackupLMDataDatasource.name, schema: BackupSchemaDatasource },
      { name: BackupLMDataGeneral.name, schema: BackupSchemaGeneral },
    ]),
  ],
})
export class TasksModule {}
