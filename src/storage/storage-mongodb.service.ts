import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BackupLMDataDatasource,
  BackupLMDataGeneral,
  BackupDocumentDatasource,
  BackupDocumentGeneral,
} from './schemas/storage-mongodb.schema';

@Injectable()
export class StorageServiceMongoDB {
  constructor(
    @InjectModel(BackupLMDataDatasource.name)
    private readonly backupDatasourceModel: Model<BackupDocumentDatasource>,
    @InjectModel(BackupLMDataGeneral.name)
    private readonly backupGeneralModel: Model<BackupDocumentGeneral>,
  ) {}

  async upsert(
    filter: any,
    upsertBackupLMData: BackupLMDataDatasource | BackupLMDataGeneral,
  ): Promise<BackupLMDataDatasource | BackupLMDataGeneral> {
    if (upsertBackupLMData.type !== 'datasource') {
      const upsertBackup = await this.backupGeneralModel.updateOne(
        filter,
        { $set: upsertBackupLMData },
        { upsert: true },
      );
      if (upsertBackup.upsertedId) {
        return this.backupGeneralModel.findById(upsertBackup.upsertedId).exec();
      } else {
        return this.backupGeneralModel.findOne(filter).exec();
      }
    }
    if (upsertBackupLMData.type === 'datasource') {
      const upsertBackup = await this.backupDatasourceModel.updateOne(
        filter,
        { $set: upsertBackupLMData },
        { upsert: true },
      );
      if (upsertBackup.upsertedId) {
        return this.backupDatasourceModel
          .findById(upsertBackup.upsertedId)
          .exec();
      } else {
        return this.backupDatasourceModel.findOne(filter).exec();
      }
    }
  }

  // Define types and return types for the find method
  async find(filter: any): Promise<any> {
    return this.backupDatasourceModel.find(filter).exec();
  }
}
