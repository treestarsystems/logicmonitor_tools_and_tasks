import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ResponseObjectDefault } from '../utils/utils.models';
import { HealthService } from './health.service';

/**
 * HealthController class to handle all health related API calls.
 * @class HealthController
 * @memberof module:health
 * @public
 */
@Controller('health')
@ApiTags('Health')
export class HealthController {
  /**
   * Initializes the HealthController with the required HealthService dependency.
   * @param {HealthService} healthService - The HealthService instance injected.
   */
  constructor(private readonly healthService: HealthService) {}

  /**
   * Return a quick health response for this service.
   * @param {Response} response - The response object.
   * @returns {void} Executes the health check.
   * @function GET
   */
  @Get('quick')
  @ApiOperation({
    summary: 'Return a quick health response for this service.',
  })
  @ApiResponse({
    type: ResponseObjectDefault,
    status: 200,
    description: 'Health check executed successfully.',
  })
  executeHealthCheckQuick(@Res() response: Response): void {
    this.healthService.executeHealthCheckQuick(response);
  }
}
