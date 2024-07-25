import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';
import { BackupServiceDatasources } from './tools-backup-datasources.service';
import { UtilsService } from '../utils/utils.service';
import { StorageServiceMongoDB } from '../storage/storage-mongodb.service';
import { StorageServiceZip } from '../storage/storage-zip.service';
import {
  BackupLMData,
  BackupSchema,
} from '../storage/schemas/storage-mongodb.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BackupLMData.name, schema: BackupSchema },
    ]),
  ],
  controllers: [ToolsController],
  providers: [
    ToolsService,
    BackupServiceDatasources,
    UtilsService,
    StorageServiceMongoDB,
    StorageServiceZip,
  ],
})
export class ToolsModule {}
