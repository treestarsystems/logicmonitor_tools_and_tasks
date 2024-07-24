import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BackupLMDataMongoDto } from './dto/storage.dto';
import { Backup } from 'src/storage/schemas/storage.schema';
import { BackupDocument } from 'src/storage/schemas/storage.schema';

@Injectable()
export class StorageService {
  constructor(
    @InjectModel(Backup.name)
    private readonly backupModel: Model<BackupDocument>,
  ) {}

  async create(
    createBackupLMDataMongoDto: BackupLMDataMongoDto,
  ): Promise<Backup> {
    const createBackup = new this.backupModel(createBackupLMDataMongoDto);
    return createBackup.save();
  }

  async upsert(
    filter: any,
    upsertBackupLMDataMongoDto: BackupLMDataMongoDto,
  ): Promise<Backup> {
    const upsertBackup = await this.backupModel.updateOne(
      filter,
      { $set: upsertBackupLMDataMongoDto },
      { upsert: true },
    );
    if (upsertBackup.upsertedId) {
      return this.backupModel.findById(upsertBackup.upsertedId).exec();
    } else {
      return this.backupModel.findOne(filter).exec();
    }
  }
}
