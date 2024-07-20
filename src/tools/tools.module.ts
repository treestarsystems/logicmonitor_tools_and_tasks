import { Module } from '@nestjs/common';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';
import { BackupService } from './backup.service';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  controllers: [ToolsController],
  providers: [ToolsService, BackupService, UtilsService],
})
export class ToolsModule {}
