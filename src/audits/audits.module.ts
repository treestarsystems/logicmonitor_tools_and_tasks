import { Module } from '@nestjs/common';
import { AuditsService } from './audits.service';
import { AuditsController } from './audits.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BackupServiceGeneral } from '../tools/tools-backup-general.service';
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
    AuditsService,
    BackupServiceGeneral,
    UtilsService,
    StorageServiceMongoDB,
    StorageServiceZip,
  ],
  controllers: [AuditsController],
})
export class AuditsModule {}
