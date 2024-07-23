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
    const createdCat = new this.backupModel(createBackupLMDataMongoDto);
    return createdCat.save();
  }
}
