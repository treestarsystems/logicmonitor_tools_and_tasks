import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BackupLMData as BackupLMDataModel } from './storage.schema';
import { BackupLMData as BackupLMDataDto } from '../utils/utils.models';
@Injectable()
export class MongodbStorageService {
  constructor(
    @InjectModel(BackupLMDataModel.name)
    private BackupLMDataModel: Model<BackupLMDataModel>,
  ) {}

  async create(createBackupDto: BackupLMDataDto): Promise<BackupLMDataModel> {
    const createBackup = new this.BackupLMDataModel(createBackupDto);
    return createBackup.save();
  }

  async findAll(): Promise<BackupLMDataModel[]> {
    return this.BackupLMDataModel.find().exec();
  }
}
