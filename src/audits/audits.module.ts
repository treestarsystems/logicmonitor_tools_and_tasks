import { Module } from '@nestjs/common';
import { AuditsService } from './audits.service';
import { AuditsController } from './audits.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageServiceMongoDB } from 'src/storage/storage-mongodb.service';
import { UtilsService } from 'src/utils/utils.service';
// import {
//   BackupLMDataAudits,
//   BackupDocumentAudits,
// } from '../storage/schemas/storage-mongodb.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      // { name: BackupLMDataAudits.name, schema: BackupDocumentAudits },
    ]),
  ],
  providers: [AuditsService, UtilsService, StorageServiceMongoDB],
  controllers: [AuditsController],
})
export class AuditsModule {}
