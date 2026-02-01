import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

/**
 * HealthModule to handle all health related operations.
 * @class HealthModule
 * @memberof module:health
 * @public
 */
@Module({
  providers: [HealthService],
  controllers: [HealthController],
})
export class HealthModule {}
