import { Injectable } from '@nestjs/common';
import { BackupServiceDatasources } from '../tools/tools-backup-datasources.service';
import { BackupServiceGeneral } from '../tools/tools-backup-general.service';
@Injectable()
export class TasksService {
  constructor(
    private backupServiceDatasources: BackupServiceDatasources,
    private backupServiceGeneral: BackupServiceGeneral,
  ) {}

  //   getTaskList(): string {
  //     return 'This action returns all tasks';
  //   }

  async executeTaskBackups(taskId: string): Promise<void> {}
}
