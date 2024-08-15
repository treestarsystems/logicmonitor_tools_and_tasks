import { Injectable } from '@nestjs/common';
import {
  ResponseObjectDefault,
  ResponseObjectDefaultGenerator,
} from '../utils/utils.models';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class AuditsService {
  constructor(private utilsService: UtilsService) {}
}
