import { Body, Controller, Post, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { BackupServiceDatasources } from './tools-backup-datasources.service';
import { BackupServiceGeneral } from './tools-backup-general.service';
import {
  ResponseObjectDefault,
  ToolsBackupDatasourcesRequest,
  ToolsBackupGeneralRequest,
} from '../utils/utils.models';
import { Get, Query } from '@nestjs/common';

/**
 * ToolsController class to handle all tools and tasks related API calls.
 * @class ToolsController
 * @memberof module:tools
 * @endpoint tools
 * @public
 */

@Controller('tools')
export class ToolsController {
  constructor(
    private readonly backupServiceDatasources: BackupServiceDatasources,
    private readonly backupServiceGeneral: BackupServiceGeneral,
  ) {}

  /**
   * Retrieve all datasource, alert rule, and report backups as a .zip file containing XML and JSON files.
   * @param {string} company The company name.
   * @param {Response} response The response object.
   * @returns {Promise<void>} Promise object.
   * @method GET
   */

  @Get('backup')
  @ApiOperation({
    summary:
      'Retrieve all datasource, alert rule, and report backups as a .zip file containing XML and JSON files.',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  @ApiTags('Tools: Backup')
  async retrieveBackupsAll(
    @Query('company') company: string,
    @Res() response: Response,
  ): Promise<void> {
    await this.backupServiceGeneral.retrieveBackupsAll(company, response);
  }

  /**
   * Backup datasources where the group name contains the groupName provided.
   * @param {ToolsBackupDatasourcesRequest} body - The request body.
   * @param {Response} response - The response object.
   * @returns {Promise<void>} Promise object.
   * @method POST
   */

  @Post('backup/datasources/bygroupname')
  @ApiOperation({
    summary:
      'Backup datasources where the group name contain the groupName provided.',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  @ApiTags('Tools: Backup')
  async backupDatasourcesPost(
    @Body() body: ToolsBackupDatasourcesRequest,
    @Res() response: Response,
  ): Promise<void> {
    await this.backupServiceDatasources.backupDatasourcesByGroupName(
      body.company,
      body.accessId,
      body.accessKey,
      body.groupName,
      response,
    );
  }

  /**
   * Backup alert rules.
   * @param {ToolsBackupGeneralRequest} body - The request body.
   * @param {Response} response - The response object.
   * @returns {Promise<void>} Promise object.
   * @function backupGeneralGetAlertRules
   * @memberof module:tools
   * @endpoint tools/backup/alertrules
   * @method POST
   */

  @Post('backup/alertrules')
  @ApiOperation({
    summary: 'Backup alert rules',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  @ApiTags('Tools: Backup')
  async backupGeneralGetAlertRules(
    @Body() body: ToolsBackupGeneralRequest,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    await this.backupServiceGeneral.backupGeneralGet(
      body.company,
      body.accessId,
      body.accessKey,
      body.extraRequestProperties,
      request,
      response,
    );
  }

  /**
   * Backup reports.
   * @param {ToolsBackupGeneralRequest} body - The request body.
   * @param {Response} response - The response object.
   * @returns {Promise<void>} Promise object.
   * @function backupGeneralGetReports
   * @memberof module:tools
   * @endpoint tools/backup/reports
   * @method POST
   */

  @Post('backup/reports')
  @ApiOperation({
    summary: 'Backup reports',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  @ApiTags('Tools: Backup')
  async backupGeneralGetReports(
    @Body() body: ToolsBackupGeneralRequest,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    await this.backupServiceGeneral.backupGeneralGet(
      body.company,
      body.accessId,
      body.accessKey,
      body.extraRequestProperties,
      request,
      response,
    );
  }
}
