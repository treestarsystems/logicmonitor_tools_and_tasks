import { Controller, Version } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('schedules')
export class ApiController {
  constructor(private readonly appService: ApiService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
