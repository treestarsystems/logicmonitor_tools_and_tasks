import { Injectable } from '@nestjs/common';

/**
 * StorageServiceMongoDB class to handle all MongoDB related operations.
 * @class StorageServiceMongoDB
 * @memberof module:storage
 * @injectable
 * @public
 * @export
 * @api
 */
@Injectable()
export class StorageServiceMongoDB {
  constructor() {}

  /**
   * Upsert the backup data to MongoDB.
   * The types should be defined when the method is called.
   * @param mongooseModel  The Mongoose model object to use for the upsert.
   * @param filter  The filter object to use for the upsert.
   * @param upsertBackupLMData  The backup data to upsert.
   * @returns
   */

  async upsert(mongooseModel, filter, upsertBackupLMData): Promise<any> {
    const upsertBackup = await mongooseModel.updateOne(
      filter,
      { $set: upsertBackupLMData },
      { upsert: true },
    );
    if (upsertBackup.upsertedId) {
      return mongooseModel.findById(upsertBackup.upsertedId).exec();
    } else {
      return mongooseModel.findOne(filter).exec();
    }
  }

  // TODO: Define types and return types for the find method
  /**
   * Find the backup data from MongoDB.
   * @param mongooseModel  The Mongoose model object to use for the find.
   * @param filter  The filter object to use for the find.
   * @returns
   */

  async find(mongooseModel, filter = {}): Promise<any> {
    return mongooseModel.find(filter).exec();
  }
}
