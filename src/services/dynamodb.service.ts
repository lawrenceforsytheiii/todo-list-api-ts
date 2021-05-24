import * as AWS from 'aws-sdk';

// Models
import ResponseModel from '../models/response.model';

// Interfaces
import Config from '../interfaces/config.interface';

// Enums
import { StatusCode } from "../enums/status-code.enum";
import { ResponseMessage } from "../enums/response-message.enum";

// Put
type PutItem = AWS.DynamoDB.DocumentClient.PutItemInput;
type PutItemOutput = AWS.DynamoDB.DocumentClient.PutItemOutput;

// Batch write
type BatchWrite = AWS.DynamoDB.DocumentClient.BatchWriteItemInput;
type BatchWriteOutput = AWS.DynamoDB.DocumentClient.BatchWriteItemOutput;

// Update
type UpdateItem = AWS.DynamoDB.DocumentClient.UpdateItemInput;
type UpdateItemOutput = AWS.DynamoDB.DocumentClient.UpdateItemOutput;

// Query
type QueryItem = AWS.DynamoDB.DocumentClient.QueryInput;
type QueryItemOutput = AWS.DynamoDB.DocumentClient.QueryOutput;

// Get
type GetItem = AWS.DynamoDB.DocumentClient.GetItemInput;
type GetItemOutput = AWS.DynamoDB.DocumentClient.GetItemOutput;

// Delete
type DeleteItem = AWS.DynamoDB.DocumentClient.DeleteItemInput;
type DeleteItemOutput = AWS.DynamoDB.DocumentClient.DeleteItemOutput;

type Item = {[index: string]: string};

const {
  STAGE,
  DYNAMODB_LOCAL_STAGE,
  DYNAMODB_LOCAL_ACCESS_KEY_ID,
  DYNAMODB_LOCAL_SECRET_ACCESS_KEY,
  DYNAMODB_LOCAL_ENDPOINT
} = process.env;

const config: Config = { region: "us-east-1" };
if (STAGE === DYNAMODB_LOCAL_STAGE) {
    config.accessKeyId = DYNAMODB_LOCAL_ACCESS_KEY_ID;
    config.secretAccessKey = DYNAMODB_LOCAL_SECRET_ACCESS_KEY;
    config.endpoint = DYNAMODB_LOCAL_ENDPOINT;
}
AWS.config.update(config);

const documentClient = new AWS.DynamoDB.DocumentClient();

export default class DynamoDBService {

  create = async(params: PutItem): Promise<PutItemOutput> => {
    try {
      return await documentClient.put(params).promise();
    } catch (error) {
      console.error(`create-error: ${error}`);
      throw new ResponseModel({}, 500, `create-error: ${error}`);
    }
  };

  batchCreate = async(params: BatchWrite): Promise<BatchWriteOutput> => {
    try {
      return await documentClient.batchWrite(params).promise();
    } catch (error) {
      console.error(`batch-write-error: ${error}`);
      throw new ResponseModel({}, 500, `batch-write-error: ${error}`);
    }
  };

  update = async (params: UpdateItem): Promise<UpdateItemOutput> => {
    try {
      return await documentClient.update(params).promise();
    } catch (error) {
      console.error(`update-error: ${error}`);
      throw new ResponseModel({}, 500, `update-error: ${error}`);
    }
  };

  query = async (params: QueryItem): Promise<QueryItemOutput> => {
    try {
      return await documentClient.query(params).promise();
    } catch (error) {
      console.error(`query-error: ${error}`);
      throw new ResponseModel({}, 500, `query-error: ${error}`);
    }
  };

  get = async (params: GetItem): Promise<GetItemOutput> => {
    try {
      return await documentClient.get(params).promise();
    } catch (error) {
      console.error(`get-error: ${error}`);
      throw new ResponseModel({}, 500, `get-error: ${error}`);
    }
  };

  getItem = async ({ key, hash, hashValue, tableName}: Item) => {
    const params = {
      TableName: tableName,
      Key: {
        id: key,
      },
    }
    if (hash) {
      params.Key[hash] = hashValue;
    }
    const results = await this.get(params);
    if (Object.keys(results).length) {
      return results;
    }
    console.error('Item does not exist');
    throw new ResponseModel({ id: key }, StatusCode.BAD_REQUEST, ResponseMessage.INVALID_REQUEST)
  };

  delete = async (params: DeleteItem): Promise<DeleteItemOutput> => {
    try {
      return await documentClient.delete(params).promise();
    } catch (error) {
      console.error(`delete-error: ${error}`);
      throw new ResponseModel({}, 500, `delete-error: ${error}`);
    }
  };
};