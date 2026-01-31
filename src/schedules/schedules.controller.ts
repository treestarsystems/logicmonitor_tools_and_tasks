import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { SchedulesService } from './schedules.service';
import { ResponseObjectDefault } from 'src/utils/utils.models';

/**
 * SchedulesController class to handle all tasks related API calls.
 * @class SchedulesController
 * @memberof module:schedules
 * @public
 */
@Controller('schedules')
@ApiTags('Schedules')
export class SchedulesController {
  /**
   * Creates an instance of SchedulesController.
   * @param {SchedulesService} schedulesService - The schedules service instance.
   */
  constructor(private readonly schedulesService: SchedulesService) {}

  /**
   * Lists all scheduled cron jobs.
   * @param {Response} response - The response object to send the result.
   * @returns {void} - Returns void.
   * @function GET
   */
  @Get()
  @ApiOperation({
    summary: 'List all scheduled cron jobs.',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  listCronJobsGet(@Res() response: Response): void {
    this.schedulesService.scheduleListCronJobs(response);
  }
}
