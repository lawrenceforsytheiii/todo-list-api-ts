import * as AWS from 'aws-sdk';

// Models
import ResponseModel from '../models/response.model';

// Interfaces
import Config from '../interfaces/config.interface';

// Enums
import { StatusCode } from "../enums/status-code.enum";
import { RESPONSE_MESSAGE } from "../enums/response-message.enum";

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

AWS.config.update({ region: "us-east-1" });

const documentClient = new AWS.DynamoDB.DocumentClient();

export default class DynamoDBService {

  create = async(params: PutItem): Promise<PutItemOutput> => {
    try {
      return await documentClient.put(params).promise();
    } catch (error) {
      throw new ResponseModel({}, 500, `create-error: ${error}`);
    }
  };

  batchCreate = async(params: BatchWrite): Promise<BatchWriteOutput> => {
    try {
      return await documentClient.batchWrite(params).promise();
    } catch (error) {
      throw new ResponseModel({}, 500, `batch-write-error: ${error}`);
    }
  };

  update = async (params: UpdateItem): Promise<UpdateItemOutput> => {
    try {
      return await documentClient.update(params).promise();
    } catch (error) {
      throw new ResponseModel({}, 500, `update-error: ${error}`);
    }
  };

  query = async (params: QueryItem): Promise<QueryItemOutput> => {
    try {
      return await documentClient.query(params).promise();
    } catch (error) {
      throw new ResponseModel({}, 500, `query-error: ${error}`);
    }
  };

  get = async (params: GetItem): Promise<GetItemOutput> => {
    try {
      return await documentClient.get(params).promise();
    } catch (error) {
      throw new ResponseModel({}, 500, `get-error: ${error}`);
    }
  };

  delete = async (params: DeleteItem): Promise<DeleteItemOutput> => {
    try {
      return await documentClient.delete(params).promise();
    } catch (error) {
      throw new ResponseModel({}, 500, `delete-error: ${error}`);
    }
  };
};