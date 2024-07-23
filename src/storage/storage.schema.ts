import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BackupDocument = HydratedDocument<BackupLMData>;

/**
 * This class is used to store the data from LogicMonitor API calls to a backend storage point like MongoDB.
 * The data is stored in 2 different formats, XMLl and JSON.:
 * @type - type of data being backed up (dataSource|report|alertRule).
 * @dataXML - The XML data from the API call.
 * @dataJSON - The JSON data from the API call.
 */
@Schema({
  collection: 'backups',
})
export class BackupLMData {
  @Prop()
  type: string;

  @Prop()
  dataXML: string;

  @Prop()
  // I have no idea what this is supposed to be, but it's not a string
  dataJSON: Map<string, any>;
}

export const BackupSchema = SchemaFactory.createForClass(BackupLMData);
