import { Injectable } from '@nestjs/common';
import { ResponseObjectDefault } from 'src/utils/models.service';

@Injectable()
export class ApiService {
  getHello(): ResponseObjectDefault {
    return {
      status: 'success',
      httpStatus: 200,
      message: 'Hello, World!',
      payload: [],
    };
  }
}
