import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import {
  ResponseObjectDefault,
  ToolsBackupDatasourcesRequest,
} from '../utils/utils.models';

import { TasksService } from './tasks.service';

@Controller('tasks')
@ApiTags('Tasks: Backup')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Post('backup')
  @ApiOperation({
    summary:
      'Backup datasources where the group name contain the groupName provided.',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  @ApiTags('Tools: Backup')
  async backupDatasourcesPost(
    @Body() body: ToolsBackupDatasourcesRequest,
    @Res() response: Response,
  ): Promise<void> {
    await this.tasksService.executeTaskBackups(
      body.company,
      body.accessId,
      body.accessKey,
      body.groupName,
      response,
    );
  }
}
