import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import {
  ResponseObjectDefault,
  ToolsBackupDatasourcesRequest,
  GeneralRequest,
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
@ApiTags('Tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Execute all backups (datasources by group name, alert rules, and report).
   * @param {ToolsBackupDatasourcesRequest} body - The request body.
   * @param {Response} response - The response object.
   * @returns {Promise<void>} Promise object.
   * @function backupDatasourcesPost
   * @memberof module:tasks
   * @endpoint tasks/backups
   * @method POST
   * @api
   * @example
   * curl -X POST "http://localhost:3000/tasks/backups" -H "Content-Type: application/json" -d '{"company":"companyName","accessId":"accessId","accessKey":"accessKey","groupName":"groupName"}'
   */
  @Post('backups')
  @ApiOperation({
    summary:
      'Execute all backups (datasources by group name, alert rules, and report).',
  })
  @ApiResponse({ type: ResponseObjectDefault })
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

  /**
   * Execute all audit tasks (sdt, collector version).
   * @param {GeneralRequest} body - The request body.
   * @param {Response} response - The response object.
   * @returns {Promise<void>} Promise object.
   * @function executeTaskAuditsPost
   * @memberof module:tasks
   * @endpoint tasks/audits
   * @method POST
   * @api
   * @example
   * curl -X POST "http://localhost:3000/tasks/audits" -H "Content-Type: application/json" -d '{"company":"companyName","accessId":"accessId","accessKey":"accessKey"}'
   */
  @Post('audits')
  @ApiOperation({
    summary: 'Execute all audit tasks (sdt, collector version).',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  async executeTaskAuditsPost(
    @Body() body: GeneralRequest,
    @Res() response: Response,
  ): Promise<void> {
    await this.tasksService.executeTaskAudits(
      body.company,
      body.accessId,
      body.accessKey,
      response,
    );
  }
}
