import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('schedules')
@ApiTags('Schedules')
export class SchedulesController {}
