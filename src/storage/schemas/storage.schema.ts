import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IsString, IsNotEmpty } from 'class-validator';

export type BackupDocument = HydratedDocument<BackupLMData>;

/**
 * This class is used to store the data from LogicMonitor API calls to a backend storage point like MongoDB.
 * The data is stored in 2 different formats, XMLl and JSON.:
 * @type - Type of data being backed up (dataSource|report|alertRule).
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
// @Schema()
export class BackupLMData {
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

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  readonly group: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  readonly dataXML: string;

  @IsNotEmpty()
  @Prop({ required: true, type: Map })
  readonly dataJSON: Map<string, any> | object;
}

export const BackupSchema = SchemaFactory.createForClass(BackupLMData);
