import { Injectable } from '@nestjs/common';
import { DefaultResponseObject } from 'src/utils/models.service';

@Injectable()
export class ApiService {
  getHello(): DefaultResponseObject {
    return {
      status: 'success',
      message: 'Hello, World!',
      payload: [],
    };
  }
}
