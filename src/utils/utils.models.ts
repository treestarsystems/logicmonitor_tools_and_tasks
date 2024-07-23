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
 * @accessId - The access ID for the LogicMonitor account.
 * @accessKey - The access key for the LogicMonitor account.
 */
export class BaseRequestObjectLM {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accessId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accessKey: string;
}

/**
 * This class is used to repsond with data from the underlying API calls in a default format.
 * The data is stored in the following format:
 * @status - The status of the API call (success|failure).
 * @httpStatus - The HTTP status code of the API call.
 * @message - The message from the API call.
 * @payload - The payload from the API call.
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
 * @method - The method to use for the API call.
 * @accessId - The access ID for the LogicMonitor account.
 * @accessKey - The access key for the LogicMonitor account.
 * @epoch - The current epoch time.
 * @resourcePath - The path to the resource that the API call is being made to.
 * @queryParams - The query parameters for the API call.
 * @requestData - The data to send in the API call.
 * @url - The URL for the API call.
 * @apiVersion - The version of the API to use.
 *
 */
export class RequestObjectLMApi extends BaseRequestObjectLM {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  method: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  epoch: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  resourcePath: string;

  @IsString()
  @ApiProperty()
  queryParams: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  requestData: Object;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  url: Function;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  apiVersion: number;
}

/**
 * This class is used to store the data from LogicMonitor API calls to a backend storage point like MongoDB.
 * The data is stored in 2 different formats, XMLl and JSON.:
 * @type - type of data being backed up (dataSource|report|alertRule).
 * @dataXML - The XML data from the API call.
 * @dataJSON - The JSON data from the API call.
 */
export class BackupLMData {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  group: string;

  @IsString()
  @IsNotEmpty()
  dataXML: string;

  @IsObject()
  @IsNotEmpty()
  dataJSON: object;
}

/**
 * This class is used to store request data for LogicMonitor API calls.
 * @company - The company name for the LogicMonitor account.
 * @accessId - The access ID for the LogicMonitor account.
 * @accessKey - The access key for the LogicMonitor account.
 * @searchString - The search string to filter the datasources by group name.
 */
export class ToolsBackupDatasourcesRequestDto extends BaseRequestObjectLM {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  company: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  searchString: string;
}
