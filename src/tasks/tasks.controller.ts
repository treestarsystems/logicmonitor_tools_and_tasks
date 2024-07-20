import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('tasks')
@ApiTags('tasks')
export class TasksController {}
