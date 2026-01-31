import { Module } from '@nestjs/common';
import { AuditsService } from './audits.service';
import { AuditsController } from './audits.controller';
import { StorageServiceMongoDB } from 'src/storage/storage-mongodb.service';
import { UtilsService } from 'src/utils/utils.service';

/**
 * AuditsModule to handle all audit related tasks.
 * @class AuditsModule
 * @memberof module:audits
 * @public
 */
@Module({
  providers: [AuditsService, UtilsService, StorageServiceMongoDB],
  controllers: [AuditsController],
})
export class AuditsModule {}
