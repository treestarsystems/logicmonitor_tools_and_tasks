import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { ModelsService } from './models.service';

@Module({
  providers: [UtilsService, ModelsService],
  controllers: [],
})
export class UtilsModule {}
