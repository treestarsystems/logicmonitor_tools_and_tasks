import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseObjectDefault } from 'src/utils/models.service';

@Controller()
@ApiTags('schedules')
export class ApiController {
  constructor(private readonly appService: ApiService) {}

  @Get()
  @ApiOkResponse({ type: ResponseObjectDefault })
  getHello(): ResponseObjectDefault {
    return this.appService.getHello();
  }
}
