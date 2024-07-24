import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BackupLMData } from 'src/storage/schemas/storage.schema';
import { BackupDocument } from 'src/storage/schemas/storage.schema';

@Injectable()
export class StorageService {
  constructor(
    @InjectModel(BackupLMData.name)
    private readonly backupModel: Model<BackupDocument>,
  ) {}

  async upsert(
    filter: any,
    upsertBackupLMData: BackupLMData,
  ): Promise<BackupLMData> {
    const upsertBackup = await this.backupModel.updateOne(
      filter,
      { $set: upsertBackupLMData },
      { upsert: true },
    );
    if (upsertBackup.upsertedId) {
      return this.backupModel.findById(upsertBackup.upsertedId).exec();
    } else {
      return this.backupModel.findOne(filter).exec();
    }
  }

  // Define types and return types for the find method
  async find(filter: any): Promise<any> {
    return this.backupModel.find(filter).exec();
  }
}
