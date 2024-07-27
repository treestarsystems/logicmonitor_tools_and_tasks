import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  IsNotEmpty,
} from 'class-validator';

/**
 * This is a base class used to store request data for LogicMonitor API calls.
 * @accessId The access ID for the LogicMonitor account.
 * @accessKey The access key for the LogicMonitor account.
 */

export class BaseRequestObjectLM {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The access ID for the LogicMonitor account. This is used to authenticate the API call',
    type: 'string',
  })
  accessId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The access key for the LogicMonitor account. This is used to authenticate the API call',
    type: 'string',
  })
  accessKey: string;
}

/**
 * This class is used to repsond with data from the underlying API calls in a default format.
 * The data is stored in the following format:
 * @status The status of the API call (success|failure).
 * @httpStatus The HTTP status code of the API call.
 * @message The message from the API call.
 * @payload The payload from the API call.
 */

export class ResponseObjectDefault {
  @IsString()
  @ApiProperty({
    description: 'The custom status of the API call',
    enum: ['success|failure'],
  })
  status: string;

  @IsNumber()
  @ApiProperty({
    description: 'HTTP status code provided by the API call',
    enum: [200, 400, 401, 403, 404, 500],
  })
  httpStatus: number;

  @IsString()
  @ApiProperty({
    description:
      'The message from the API call. This can be a success or error message',
    type: 'string',
  })
  message: string;

  @IsArray()
  @ApiProperty({
    description:
      'The payload from the API call. This can be an array of any type',
    type: [],
    enum: ['any (string|number|object|array|boolean|error object)'],
  })
  payload: any[any];
}

/**
 * This class is used to store the data that is needed to make a call to the LogicMonitor API. This is only accessible via the backend.
 * The data is stored in the following format:
 * @method The method to use for the API call.
 * @accessId The access ID for the LogicMonitor account.
 * @accessKey The access key for the LogicMonitor account.
 * @epoch The current epoch time.
 * @resourcePath The path to the resource that the API call is being made to.
 * @queryParams The query parameters for the API call.
 * @requestData The data to send in the API call.
 * @url The URL for the API call.
 * @apiVersion The version of the API to use.
 */

export class RequestObjectLMApi extends BaseRequestObjectLM {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The method to use for the API call. This can be GET, POST, PUT, DELETE',
    type: 'string',
  })
  method: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The current epoch time. This is used to authenticate the API call',
    type: 'string',
  })
  epoch: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The path to the resource that the underlying API call is being made to.',
    type: 'string',
  })
  resourcePath: string;

  @IsString()
  @ApiProperty({
    description:
      'The query parameters for the API call. This is used to filter the data being returned in some cases.',
    type: 'string',
  })
  queryParams: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The data to send in the API call. This is used to create or update data in LogicMonitor.',
    type: 'string',
  })
  requestData: Object;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The URL for the API call.',
    type: 'string',
  })
  url: Function;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The version of the API to use. This should be 3, which is the current version of the LogicMonitor API.',
    type: 'string',
  })
  apiVersion: number;
}

/**
 * This class is used to store request data for LogicMonitor API calls.
 * @company The company name for the LogicMonitor account.
 * @accessId The access ID for the LogicMonitor account.
 * @accessKey The access key for the LogicMonitor account.
 * @searchString The search string to filter the datasources by group name.
 */

export class ToolsBackupDatasourcesRequest extends BaseRequestObjectLM {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The company name for the LogicMonitor account.',
    type: 'string',
  })
  company: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The search string to filter the datasources by group name.',
    type: 'string',
  })
  groupName: string;
}

/**
 * Extra request properties to send in the API call (resourcePath, queryParams, requestData).
 * @resourcePath The path to the resource that the underlying API call is being made to.
 * @queryParams The query parameters for the API call. This is used to filter the data being returned in some cases.
 * @requestData The data to send in the API call. This is used to create or update data in LogicMonitor.
 */

export class RequestObjectLMApiExtraRequestProperties {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The path to the resource that the underlying API call is being made to.',
    type: 'string',
  })
  resourcePath: string;

  @Optional()
  @IsString()
  @ApiProperty({
    description:
      'The query parameters for the API call. This is used to filter the data being returned in some cases.',
    type: 'string',
    required: false,
  })
  queryParams: string;

  @Optional()
  @IsObject()
  @ApiProperty({
    description:
      'The data to send in the API call. This is used to create or update data in LogicMonitor.',
    type: 'string',
    required: false,
  })
  requestData: Object;
}

/**
 * This class is used to store request data for LogicMonitor API calls.
 * @company The company name for the LogicMonitor account.
 * @accessId The access ID for the LogicMonitor account.
 * @accessKey The access key for the LogicMonitor account.
 * @extraRequestProperties The extra request properties to send in the API call (resourcePath, queryParams, requestData).
 */

export class ToolsBackupGeneralRequest extends BaseRequestObjectLM {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The company name for the LogicMonitor account.',
    type: 'string',
  })
  company: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The extra request properties to send in the API call',
    type: RequestObjectLMApiExtraRequestProperties,
  })
  extraRequestProperties: RequestObjectLMApiExtraRequestProperties;
}
