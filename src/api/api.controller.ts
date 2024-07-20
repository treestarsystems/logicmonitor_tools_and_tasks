import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DefaultResponseObject } from 'src/utils/models.service';

@Controller()
@ApiTags('schedules')
export class ApiController {
  constructor(private readonly appService: ApiService) {}

  @Get()
  @ApiOkResponse({ type: DefaultResponseObject })
  getHello(): DefaultResponseObject {
    return this.appService.getHello();
  }
}
