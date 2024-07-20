import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('tools')
@ApiTags('tools')
export class ToolsController {}
