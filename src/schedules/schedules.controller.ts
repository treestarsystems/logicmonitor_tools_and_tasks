import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SchedulesService } from './schedules.service';
import { ResponseObjectDefault } from 'src/utils/utils.models';

@Controller('schedules')
@ApiTags('Schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  @ApiOperation({
    summary: 'List all scheduled cron jobs.',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  async listCronJobsGet(@Res() response: Response): Promise<void> {
    await this.schedulesService.scheduleListCronJobs(response);
  }
}
