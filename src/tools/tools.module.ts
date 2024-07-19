import { Module } from '@nestjs/common';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';
import { BackupService } from './backup.service';

@Module({
  controllers: [ToolsController],
  providers: [ToolsService, BackupService]
})
export class ToolsModule {}
