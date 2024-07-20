import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ApiService } from './api.service';
import {
  ApiDefaultResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DefaultResponseObject } from 'src/utils/models.service';

@Controller()
@ApiTags('schedules')
export class ApiController {
  constructor(private readonly appService: ApiService) {}

  @Get()
  @ApiResponse({ type: DefaultResponseObject })
  getHello(): DefaultResponseObject {
    return this.appService.getHello();
  }
}
