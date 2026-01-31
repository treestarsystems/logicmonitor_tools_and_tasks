import * as path from 'path';
import { promises as fs } from 'fs';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { Response } from 'express';
import { TasksService } from '../tasks/tasks.service';
import { ToolsBackupDatasourcesRequest } from '../utils/utils.models';
import { ResponseObjectDefault } from '../utils/utils.models';
import { UtilsService } from '../utils/utils.service';
import { ResponseObjectDefaultBuilder, ScheduleListCronJobsResponse } from '../utils/utils.models';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

/**
 * SchedulesService class to provide utility functions.
 * @class SchedulesService
 * @memberof module:schedules
 * @public
 */
@Injectable()
export class SchedulesService {
  /**
   * Creates an instance of SchedulesService.
   * @param {TasksService} tasksService - The TasksService instance.
   * @param {UtilsService} utilsService - The UtilsService instance.
   * @param {SchedulerRegistry} schedulerRegistry - The SchedulerRegistry instance.
   * @param {Logger} logger - The Winston logger instance.
   */
  constructor(
    private tasksService: TasksService,
    private utilsService: UtilsService,
    private schedulerRegistry: SchedulerRegistry,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  private readonly scheduleConfFilePath: string = path.resolve(
    __dirname,
    `../../${process.env.SCHEDULES_CONF_FILE_NAME}`
  );

  /**
   * Lists all scheduled cron jobs and their details.
   * @param {Response} response - The response object to send the result.
   * @param {boolean} [directlyRespondToApiCall=true] - Whether to directly respond to the API call or return the returnObj.
   * @returns {Response | ResponseObjectDefault | undefined} - The response object containing the list of cron jobs, or undefined when directly responding to API call.
   */
  scheduleListCronJobs(
    response: Response,
    directlyRespondToApiCall: boolean = true
  ): Response | ResponseObjectDefault | undefined {
    const returnObj: ResponseObjectDefault = new ResponseObjectDefaultBuilder().build();
    const timeZoneSettings = {
      timeZone: 'America/New_York',
    };
    const jobsGet = this.schedulerRegistry.getCronJobs();
    const jobsList = [];
    jobsGet.forEach((value, key) => {
      let next: string, last: string, future: string[] | string;
      try {
        next = value?.nextDate()?.toJSDate()?.toLocaleString('en-US', timeZoneSettings);
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
          .map(date => {
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
        futureRun: Array.isArray(future) ? future : [future],
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

  /**
   * Reads the schedule configuration from a file.
   * @param {string} confFilePath - The path to the configuration file.
   * @returns {Promise<ToolsBackupDatasourcesRequest[]>} - A promise that resolves to an array of ToolsBackupDatasourcesRequest objects.
   */
  async scheduleReadConf(confFilePath: string): Promise<ToolsBackupDatasourcesRequest[]> {
    try {
      const data = await fs.readFile(confFilePath, 'utf8');
      const confData: ToolsBackupDatasourcesRequest[] = JSON.parse(
        data
      ) as ToolsBackupDatasourcesRequest[];
      return confData;
    } catch (err) {
      this.logger.error('Error reading schedule configuration file:', err);
      return [];
    }
  }

  /**
   * Schedules a daily backup task to run at 12:00 AM, 12:00 PM, and 6:00 PM in the 'America/New_York' time zone.
   * @returns {Promise<void>} - A promise that resolves to void.
   */
  @Cron('0 0,12,18 * * *', {
    name: 'schedules.task: daily backup',
    timeZone: 'America/New_York',
  })
  async scheduleTaskDailyBackup(): Promise<void> {
    try {
      const confData = await this.scheduleReadConf(this.scheduleConfFilePath);
      for (const conf of confData) {
        this.logger.info(`Executing backup for ${conf.company.toUpperCase()}`);
        const scheduledTaskResult = (await this.tasksService.executeTaskBackups(
          conf.company,
          conf.accessId,
          conf.accessKey,
          conf.groupName,
          null,
          false
        )) as ResponseObjectDefault;
        this.logger.info(
          `Finished backup for ${conf.company.toUpperCase()} with result: ${this.utilsService.capitalizeFirstLetter(scheduledTaskResult.message)}`
        );
      }
    } catch (err) {
      this.utilsService.defaultErrorHandlerString(err);
    }
  }

  /**
   * Schedules a monthly audit task to run on the first of every month at 8:00 AM EST.
   * @returns {Promise<void>} - A promise that resolves to void.
   */
  @Cron('0 8 1 * *', {
    name: 'schedules.task: monthly audit',
    timeZone: 'America/New_York',
  })
  async scheduleTaskMonthlyAudit(): Promise<void> {
    try {
      const confData = await this.scheduleReadConf(this.scheduleConfFilePath);
      for (const conf of confData) {
        this.logger.info(`Executing monthly audit for ${conf.company.toUpperCase()}`);
        const scheduledTaskResult = (await this.tasksService.executeTaskAudits(
          conf.company,
          conf.accessId,
          conf.accessKey,
          null,
          false
        )) as ResponseObjectDefault;
        this.logger.info(
          `Finished monthly audit for ${conf.company.toUpperCase()} with result: ${this.utilsService.capitalizeFirstLetter(scheduledTaskResult.message)}`
        );
        // The result needs to be formatted and sent as an email.
        // console.log(JSON.stringify(scheduledTaskResult));
      }
    } catch (err) {
      this.utilsService.defaultErrorHandlerString(err);
    }
  }
}
