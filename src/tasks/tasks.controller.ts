import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import {
  ResponseObjectDefault,
  ToolsBackupDatasourcesRequest,
} from '../utils/utils.models';

import { TasksService } from './tasks.service';

/**
 * TasksController class to handle all tasks related API calls.
 * @class TasksController
 * @memberof module:tasks
 * @endpoint tasks
 * @public
 * @api
 */

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Execute all backups (datasources by group name, alert rules, and report).
   * @param {ToolsBackupDatasourcesRequest} body - The request body.
   * @param {Response} response - The response object.
   * @returns {Promise<void>} Promise object.
   * @function backupDatasourcesPost
   * @memberof module:tasks
   * @endpoint tasks/backup
   * @method POST
   * @api
   * @example
   * curl -X POST "http://localhost:3000/tasks/backup" -H "Content-Type: application/json" -d '{"company":"companyName","accessId":"accessId","accessKey":"accessKey","groupName":"groupName"}'
   */
  @Post('backups')
  @ApiOperation({
    summary:
      'Execute all backups (datasources by group name, alert rules, and report).',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  @ApiTags('Tasks: Backups')
  async executeTaskBackupsPost(
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
