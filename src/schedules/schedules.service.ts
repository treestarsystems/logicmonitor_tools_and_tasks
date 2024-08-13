// https://docs.nestjs.com/techniques/task-scheduling
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TasksService } from '../tasks/tasks.service';
import { promises as fs } from 'fs';
import { ToolsBackupDatasourcesRequest } from '../utils/utils.models';
import { ResponseObjectDefault } from '../utils/utils.models';
import { UtilsService } from '../utils/utils.service';
import * as path from 'path';
@Injectable()
export class SchedulesService {
  constructor(
    private tasksService: TasksService,
    private utilsService: UtilsService,
  ) {}

  private readonly scheduleConfFilePath: string = path.resolve(
    __dirname,
    `../../${process.env.SCHEDULES_CONF_FILE_NAME}`,
  );

  async scheduleReadConf(
    confFilePath,
  ): Promise<ToolsBackupDatasourcesRequest[]> {
    try {
      const data = await fs.readFile(confFilePath, 'utf8');
      const confData: ToolsBackupDatasourcesRequest[] = JSON.parse(data);
      return confData;
    } catch (err) {
      console.error('Error reading schedule configuration file:', err);
      return [];
    }
  }

  // Schedule a task to run at 12:00 AM and 12:00 PM every day.
  @Cron('0 0,12 * * *', {
    name: 'schedules.task: Daily Backup',
    timeZone: 'America/New_York',
  })
  async scheduleTaskDailyBackup() {
    try {
      const confData = await this.scheduleReadConf(this.scheduleConfFilePath);
      for (const conf of confData) {
        Logger.log(`Executing backup for ${conf.company}`);
        const scheduledTaskResult = (await this.tasksService.executeTaskBackups(
          conf.company,
          conf.accessId,
          conf.accessKey,
          conf.groupName,
          {},
        )) as ResponseObjectDefault;
        Logger.log(
          `Finished backup for ${conf.company.toUpperCase()} with result: ${this.utilsService.capitalizeFirstLetter(scheduledTaskResult.message)}`,
        );
      }
    } catch (err) {
      this.utilsService.defaultErrorHandlerString(err);
    }
  }
}
