import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SchedulesService } from './schedules.service';
import { ResponseObjectDefault } from 'src/utils/utils.models';

/**
 * SchedulesController class to handle all tasks related API calls.
 * @class SchedulesController
 * @memberof module:schedules
 * @endpoint schedules
 * @public
 */

@Controller('schedules')
@ApiTags('Schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  /**
   * Lists all scheduled cron jobs.
   * @param {Response} response - The response object to send the result.
   * @returns {Promise<void>} - A promise that resolves to void.
   * @method GET
   */

  @Get()
  @ApiOperation({
    summary: 'List all scheduled cron jobs.',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  async listCronJobsGet(@Res() response: Response): Promise<void> {
    await this.schedulesService.scheduleListCronJobs(response);
  }
}
