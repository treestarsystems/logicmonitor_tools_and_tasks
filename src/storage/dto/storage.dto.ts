export class BackupLMDataMongoDto {
  readonly type: string;
  readonly name: string;
  readonly group: string;
  readonly dataXML: string;
  readonly dataJSON: object;
}
