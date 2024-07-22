import { Controller, HttpException, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { BackupService } from './backup.service';
import {
  ResponseObjectDefault,
  ToolsBackupDatasourcesRequestDto,
} from '../utils/models.service';
import { Get, Query } from '@nestjs/common';

@Controller('tools')
@ApiTags('Tools')
export class ToolsController {
  constructor(private readonly backupService: BackupService) {}

  // Source for query DTO: https://tkssharma.com/nestjs-playing-with-query-param-dto/
  @Get('backup/datasources')
  @ApiResponse({ type: ResponseObjectDefault })
  async backupDatasources(
    @Query() query: ToolsBackupDatasourcesRequestDto,
    // @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    await this.backupService.backupDatasources(
      query.company,
      query.accessId,
      query.accessKey,
      query.searchString,
      // request,
      response,
    );
  }
}
