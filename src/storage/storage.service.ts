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
    const createdBackup = new this.backupModel(createBackupLMDataMongoDto);
    return createdBackup.save();
  }

  async upsert(
    upsertBackupLMDataMongoDto: BackupLMDataMongoDto,
  ): Promise<Backup> {
    const upsertBackup = new this.backupModel(upsertBackupLMDataMongoDto);
    return upsertBackup.updateOne(
      {
        filter: { name: upsertBackupLMDataMongoDto.name },
        update: upsertBackupLMDataMongoDto,
      },
      { upsert: true },
    );
  }
}
