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
   * @method POST
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
   * @method POST
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
