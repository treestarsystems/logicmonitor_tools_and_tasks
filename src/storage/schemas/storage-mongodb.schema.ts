import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IsString, IsNotEmpty } from 'class-validator';

// Define the types for the backup data
export type BackupDocumentDatasource = HydratedDocument<BackupLMDataDatasource>;
export type BackupDocumentGeneral = HydratedDocument<BackupLMDataGeneral>;

/**
 * This class is used to store the data from LogicMonitor API calls to a backend storage point like MongoDB.
 * @property {string} type - Type of data being backed up (datasource|report|alertrule).
 * @property {string} name - The original datasource name.
 * @property {string} formattedName - The formatted datasource name.
 * @property {string} company - The company/subdomain name.
 * @property {Map<string, any> | object} dataJSON - The JSON format of the datasource.
 */
@Schema({
  collection: 'backups',
})
export class BackupLMDataGeneral {
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  readonly type: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  readonly nameFormatted: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  readonly company: string;

  @IsNotEmpty()
  @Prop({ required: true, type: Map })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly dataJSON: Map<string, any> | object;
}

/**
 * This class is used to store the data from LogicMonitor API calls to a backend storage point like MongoDB.
 * The data is stored in 2 different formats, XML and JSON.:
 * @property {string} type - Type of data being backed up (datasource|report|alertrule).
 * @property {string} name - The original datasource name.
 * @property {string} formattedName - The formatted objects name
 * @property {string} company - The company/subdomain name.
 * @property {string} group - The group name of the data being backed up.
 * @property {string} dataXML - The XML format of the datasource.
 * @property {Map<string, any> | object} dataJSON - The JSON format of the datasource.
 */
@Schema({
  collection: 'backups',
})
export class BackupLMDataDatasource extends BackupLMDataGeneral {
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  readonly group: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  readonly dataXML: string;
}

// Create the schemas for the backup data
export const BackupSchemaDatasource = SchemaFactory.createForClass(BackupLMDataDatasource);
export const BackupSchemaGeneral = SchemaFactory.createForClass(BackupLMDataGeneral);
