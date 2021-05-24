import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult
} from 'aws-lambda';
import 'source-map-support/register';
import ResponseModel from "../../models/response.model";
import DynamoDBService from "../../services/dynamodb.service";
import { validateAgainstConstraints } from "../../utils/util";
import requestConstraints from '../../constraints/list/id.constraint.json';

export const getList: APIGatewayProxyHandler = (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = JSON.parse(event.body);

  // Initialise database service
  const dynamoDBService = new DynamoDBService();
  
  // Destructure request data
  const { listId } = requestData;

  // Destructure process.env
  const { LIST_TABLE, TASKS_TABLE } = process.env;

  // Validate against constraints
  return validateAgainstConstraints(requestData, requestConstraints)
    .then(() => {
      // Get item from the DynamoDB table
      return dynamoDBService.get({ Key: listId, TableName: LIST_TABLE });
    })
    .then( async (data) => {
      // Initialise DynamoDB QUERY parameters
      const params = {
        TableName: TASKS_TABLE,
        IndexName : 'list_index',
        KeyConditionExpression : 'listId = :listIdVal',
        ExpressionAttributeValues : {
          ':listIdVal' : listId
        }
      };

      // Query table for tasks with the listId
      const results = await dynamoDBService.query(params);
      const tasks = results?.Items?.map((task) => {
        return {
          id: task.id,
          description: task.description,
          completed: task.completed,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        }
      });

      // Set Success Response with data
      response = new ResponseModel({
        ...data.Item,
        taskCount: tasks?.length,
        tasks: tasks,
      }, 200, 'To-do list successfully retrieved');
    })
    .catch((error) => {
      // Set Error Response
      response = (error instanceof ResponseModel) ? error : new ResponseModel({}, 500, 'To-do list not found');
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};