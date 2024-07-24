import { Module } from '@nestjs/common';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';
import { BackupService } from './backup.service';
import { UtilsService } from '../utils/utils.service';
import { StorageService } from '../storage/storage.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BackupLMData, BackupSchema } from '../storage/schemas/storage.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BackupLMData.name, schema: BackupSchema },
    ]),
  ],
  controllers: [ToolsController],
  providers: [ToolsService, BackupService, UtilsService, StorageService],
})
export class ToolsModule {}
