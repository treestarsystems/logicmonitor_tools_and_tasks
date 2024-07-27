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

@Controller('tools')
export class ToolsController {
  constructor(
    private readonly backupServiceDatasources: BackupServiceDatasources,
    private readonly backupServiceGeneral: BackupServiceGeneral,
  ) {}

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

  @Post('backup/datasources')
  @ApiOperation({
    summary: 'Backup datasources where the group name contains the group name.',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  @ApiTags('Tools: Backup')
  async backupDatasourcesPost(
    @Body() body: ToolsBackupDatasourcesRequest,
    @Res() response: Response,
  ): Promise<void> {
    await this.backupServiceDatasources.backupDatasources(
      body.company,
      body.accessId,
      body.accessKey,
      body.groupName,
      response,
    );
  }

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
