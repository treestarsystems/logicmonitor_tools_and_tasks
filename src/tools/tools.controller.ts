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

  // Soruce for query DTO: https://tkssharma.com/nestjs-playing-with-query-param-dto/
  // TODO: Customize response object for validation failures.
  // - https://dev.to/nithinkjoy/how-to-use-class-validator-and-return-custom-error-object-in-nestjs-562h
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
    // try {
    //   await this.backupService.backupDatasources(
    //     query.company,
    //     query.accessId,
    //     query.accessKey,
    //     query.searchString,
    //     // request,
    //     response,
    //   );
    // } catch (err) {
    //   throw new HttpException(
    //     {
    //       status: 'failure',
    //       httpStatus: 500,
    //       message: err.message,
    //       payload: [],
    //     },
    //     500,
    //   );
    // }
  }
}
