import { Controller, Version } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { Verify } from 'crypto';

// @Controller('api')
@Controller('/')
export class ApiController {
  constructor(private readonly appService: ApiService) {}

  @Version('2')
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
