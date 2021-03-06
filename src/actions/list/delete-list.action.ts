import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import 'source-map-support/register';
import ResponseModel from "../../models/response.model";
import DynamoDBService from "../../services/dynamodb.service";
import { validateAgainstConstraints, createChunks } from "../../utils/util";
import requestConstraints from '../../constraints/list/delete.constraint.json';

export const deleteList: APIGatewayProxyHandler = (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = JSON.parse(event.body);

  // Destructure request data
  const { listId } = requestData

  // Destructure process.env
  const { LIST_TABLE, TASKS_TABLE } = process.env;

  // Initialise database service
  const dynamoDBService = new DynamoDBService();

  // Validate against constraints
  return validateAgainstConstraints(requestData, requestConstraints)
    .then(() => {
      // Get item from the DynamoDB table
      return dynamoDBService.getItem({ key: listId, tableName: LIST_TABLE });
    })
    .then(() => {
      // Initialise DynamoDB DELETE parameters
      const params = {
        TableName: LIST_TABLE,
        Key: { id: listId },
      }
      return dynamoDBService.delete(params); // Delete to-do list
    })
    .then(async () => {
      // Initialise DynamoDB QUERY parameters
      const taskParams = {
        TableName: TASKS_TABLE,
        IndexName : 'list_index',
        KeyConditionExpression : 'listId = :listIdVal',
        ExpressionAttributeValues : {
          ':listIdVal' : listId
        }
      };
      // Find tasks in list
      const results = await dynamoDBService.query(taskParams); 
      
      // Validate tasks exist
      if (results?.Items) {
        // create batch objects
        const taskEntities = results?.Items?.map((item) => {
          return { DeleteRequest: { Key: { id: item.id } } };
        });
        
        // Tasks more than 25
        // Delete in chunks
        if (taskEntities.length > 25) {
          // Create chunks if tasks more than 25
          // BATCH WRITE has a limit of 25 items
          const taskChunks = createChunks(taskEntities, 25); 
          return Promise.all(taskChunks.map((tasks) => {
            return dynamoDBService.batchCreate({
              RequestItems: {
                [TASKS_TABLE]: tasks, // Batch delete task items
              }
            });
          }));
        }
        // Batch delete task items
        return dynamoDBService.batchCreate({
          RequestItems: {
            [TASKS_TABLE]: taskEntities, 
          }
        });
      }
    })
    .then(() => {
      // Set Success Response
      response = new ResponseModel({}, 200, 'To-do list successfully deleted');
    })
    .catch((error) => {
      // Set Error Response
      response = (error instanceof ResponseModel) ? error : new ResponseModel({}, 500, 'To-do list cannot be deleted');
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};