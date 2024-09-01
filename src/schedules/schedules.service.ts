import * as path from 'path';
import { promises as fs } from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { TasksService } from '../tasks/tasks.service';
import { ToolsBackupDatasourcesRequest } from '../utils/utils.models';
import { ResponseObjectDefault } from '../utils/utils.models';
import { UtilsService } from '../utils/utils.service';
import {
  ResponseObjectDefaultBuilder,
  ScheduleListCronJobsResponse,
} from '../utils/utils.models';
@Injectable()
export class SchedulesService {
  constructor(
    private tasksService: TasksService,
    private utilsService: UtilsService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  private readonly scheduleConfFilePath: string = path.resolve(
    __dirname,
    `../../${process.env.SCHEDULES_CONF_FILE_NAME}`,
  );

  scheduleListCronJobs(
    response,
    directlyRespondToApiCall: boolean = true,
  ): ResponseObjectDefault {
    let returnObj: ResponseObjectDefault =
      new ResponseObjectDefaultBuilder().build();
    const timeZoneSettings = {
      timeZone: 'America/New_York',
    };
    const jobsGet = this.schedulerRegistry.getCronJobs();
    const jobsList = [];
    jobsGet.forEach((value, key, map) => {
      let next, last, future;
      try {
        next = value
          ?.nextDate()
          ?.toJSDate()
          ?.toLocaleString('en-US', timeZoneSettings);
      } catch (err) {
        next = this.utilsService.defaultErrorHandlerString(err);
      }
      try {
        last =
          value?.lastDate()?.toLocaleString('en-US', timeZoneSettings) ??
          'Never, or not yet run since application start.';
      } catch (err) {
        last = this.utilsService.defaultErrorHandlerString(err);
      }
      try {
        future = value
          ?.nextDates(4)
          .map((date) => {
            return date?.toJSDate()?.toLocaleString('en-US', timeZoneSettings);
          })
          .slice(1, 4);
      } catch (err) {
        future = this.utilsService.defaultErrorHandlerString(err);
      }
      const jobObj: ScheduleListCronJobsResponse = {
        jobName: key,
        nextRun: next,
        lastRun: last,
        futureRun: future,
      };
      jobsList.push(jobObj);
    });
    returnObj.payload = jobsList;
    if (directlyRespondToApiCall) {
      response.status(returnObj.httpStatus).send(returnObj);
    } else {
      return returnObj;
    }
  }

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

  // Schedule a task to run at 12:00 AM EST, 12:00 PM EST, and 6:00PM EST every day.
  @Cron('0 0,12,18 * * *', {
    name: 'schedules.task: daily backup',
    timeZone: 'America/New_York',
  })
  async scheduleTaskDailyBackup() {
    try {
      const confData = await this.scheduleReadConf(this.scheduleConfFilePath);
      for (const conf of confData) {
        Logger.log(`Executing backup for ${conf.company.toUpperCase()}`);
        const scheduledTaskResult = (await this.tasksService.executeTaskBackups(
          conf.company,
          conf.accessId,
          conf.accessKey,
          conf.groupName,
          {},
          false,
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
