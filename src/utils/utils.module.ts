import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { UtilsController } from './utils.controller';
import { ModelsService } from './models.service';

@Module({
  providers: [UtilsService, ModelsService],
  controllers: [UtilsController]
})
export class UtilsModule {}
