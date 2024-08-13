import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksService } from '../tasks/tasks.service';
import { BackupServiceDatasources } from '../tools/tools-backup-datasources.service';
import { BackupServiceGeneral } from '../tools/tools-backup-general.service';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { StorageServiceMongoDB } from 'src/storage/storage-mongodb.service';
import { StorageServiceZip } from '../storage/storage-zip.service';
import { UtilsService } from 'src/utils/utils.service';
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
  providers: [
    SchedulesService,
    TasksService,
    BackupServiceDatasources,
    BackupServiceGeneral,
    UtilsService,
    StorageServiceMongoDB,
    StorageServiceZip,
  ],
  controllers: [SchedulesController],
})
export class SchedulesModule {}
