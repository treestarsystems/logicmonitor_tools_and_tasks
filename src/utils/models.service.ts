import { Injectable } from '@nestjs/common';

export interface ResponseObject {
    status: string;
    message: string;
    payload: string;
}

@Injectable()
export class ModelsService {}
