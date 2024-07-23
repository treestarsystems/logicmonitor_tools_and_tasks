import { Injectable } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BackupSchema, BackupLMData } from './storage.schema';

@Injectable()
export class MongodbStorageService {
  //   /**
  //    * Upserts an object into a MongoDB collection based on a given filter.
  //    *
  //    * This function connects to a MongoDB database and either updates an existing
  //    * document that matches the filter criteria or inserts the provided object if
  //    * no matching document exists. It uses the MongoDB Node.js driver for database
  //    * operations.
  //    *
  //    * @param {StoreObjectLMData} storageObj - The object to be upserted in the database.
  //    * @param {Object} filter - The filter criteria used to find an existing document.
  //    * @param {string} uri - The MongoDB connection string.
  //    * @param {string} dbName - The name of the database.
  //    * @param {string} collectionName - The name of the collection where the object will be upserted.
  //    * @returns {Promise<void>} A promise that resolves when the operation is complete.
  //    *   // Example usage
  //    * const storageObj: StoreObjectLMData = {
  //    *   type: 'dataSource',
  //    *   dataXML: '<xml>Data</xml>',
  //    *   dataJSON: { key: 'value' },
  //    * };
  //    * const filter = { type: 'dataSource' }; // Example filter
  //    * const uri = 'your_mongodb_connection_string';
  //    * const dbName = 'your_database_name';
  //    * const collectionName = 'your_collection_name';
  //    * upsertToMongoDB(storageObj, filter, uri, dbName, collectionName).catch(console.error);
  //    */
  //   async upsertToMongoDB(
  //     storageObj: StoreObjectLMData,
  //     filter: object,
  //     uri: string,
  //     dbName: string,
  //     collectionName: string,
  //   ): Promise<void> {
  //     // Create a new MongoClient
  //     const client = new MongoClient(uri);
  //     try {
  //       // Connect the client to the server
  //       await client.connect();
  //       console.log('Connected successfully to server');
  //       // Get the database and collection
  //       const db: Db = client.db(dbName);
  //       const collection = db.collection(collectionName);
  //       // Upsert the storage object into the collection
  //       const result = await collection.updateOne(
  //         filter,
  //         { $set: storageObj },
  //         { upsert: true },
  //       );
  //       if (result.upsertedCount > 0) {
  //         console.log(
  //           `A document was inserted with the _id: ${result.upsertedId._id}`,
  //         );
  //       } else if (result.modifiedCount > 0) {
  //         console.log('A document was updated.');
  //       } else {
  //         console.log('No changes were made to the database.');
  //       }
  //     } catch (error) {
  //       console.error('An error occurred while upserting the object:', error);
  //       throw error; // Rethrow the error for further handling
  //     } finally {
  //       // Ensure that the client will close when you finish/error
  //       await client.close();
  //     }
  //   }
}
