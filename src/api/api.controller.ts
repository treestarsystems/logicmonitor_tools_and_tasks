import { Controller, Version } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags()
export class ApiController {
  constructor(private readonly appService: ApiService) {}

  @Get()
  @Version('2')
  @ApiTags('schedules')
  getHello(): string {
    return this.appService.getHello();
  }
}
