import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';

/**
 * UtilsModule to handle all utility related tasks.
 * @class UtilsModule
 * @memberof module:utils
 * @public
 */
@Module({
  providers: [UtilsService],
  controllers: [],
})
export class UtilsModule {}
