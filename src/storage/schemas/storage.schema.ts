import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// export type BackupDocument = HydratedDocument<BackupLMDataMongo>;
export type BackupDocument = Backup & Document;

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
// @Schema()
export class Backup {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  group: string;

  @Prop({ required: true })
  dataXML: string;

  @Prop({ required: true })
  dataJSON: Map<string, any>;
}

export const BackupSchema = SchemaFactory.createForClass(Backup);
