import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IsString, IsNotEmpty } from 'class-validator';

export type BackupDocumentDatasource = HydratedDocument<BackupLMDataDatasource>;
export type BackupDocumentGeneral = HydratedDocument<BackupLMDataGeneral>;

/**
 * This class is used to store the data from LogicMonitor API calls to a backend storage point like MongoDB.
 * The data is stored in 2 different formats, XMLl and JSON.:
 * @type - Type of data being backed up (datasource|report|alertrule).
 * @name - The original datasource name.
 * @formattedName - The formatted datasource name.
 * @company - The company/subdomain name.
 * @dataJSON - The JSON format of the datasource.
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
  readonly dataJSON: Map<string, any> | object;
}

/**
 * This class is used to store the data from LogicMonitor API calls to a backend storage point like MongoDB.
 * The data is stored in 2 different formats, XMLl and JSON.:
 * @type - Type of data being backed up (datasource|report|alertrule).
 * @name - The original datasource name.
 * @formattedName - The formatted datasource name.
 * @company - The company/subdomain name.
 * @group - The group name of the data being backed up.
 * @dataXML - The XML format of the datasource.
 * @dataJSON - The JSON format of the datasource.
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

export const BackupSchemaDatasource = SchemaFactory.createForClass(
  BackupLMDataDatasource,
);
export const BackupSchemaGeneral =
  SchemaFactory.createForClass(BackupLMDataGeneral);
