import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
    constructor(private readonly appService: ApiService) {}

    @Get()
    getHello(): string {
      return this.appService.getHello();
    }
}
