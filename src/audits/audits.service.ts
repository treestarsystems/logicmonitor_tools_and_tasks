import { Injectable } from '@nestjs/common';
import { BackupServiceGeneral } from '../tools/tools-backup-general.service';
import {
  ResponseObjectDefault,
  ResponseObjectDefaultGenerator,
} from '../utils/utils.models';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class AuditsService {
  constructor(
    private backupServiceGeneral: BackupServiceGeneral,
    private utilsService: UtilsService,
  ) {}
}
