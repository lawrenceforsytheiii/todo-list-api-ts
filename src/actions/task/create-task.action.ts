import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult
} from 'aws-lambda';
import 'source-map-support/register';
import TaskModel from "../../models/task.model";
import ResponseModel from "../../models/response.model";
import DynamoDBService from "../../services/dynamodb.service";
import { validateAgainstConstraints } from "../../utils/util";
import requestConstraints from '../../constraints/task/create.constraint.json';

export const createTask: APIGatewayProxyHandler = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = JSON.parse(event.body);

  // Initialise database service
  const dynamoDBService = new DynamoDBService();

  // Validate against constraints
  return Promise.all([
      // Validate against constraints
      validateAgainstConstraints(requestData, requestConstraints),
      // Get item from the DynamoDB table
      dynamoDBService.get({ Key: requestData.listId, TableName: process.env.LIST_TABLE })
    ])
    .then(async () => {
      // Initialise and hydrate model
      const taskModel = new TaskModel(requestData);

      // Get model data
      const data = taskModel.getEntityMappings();

      // Initialise DynamoDB PUT parameters
      const params = {
        TableName: process.env.TASKS_TABLE,
        Item: {
          id: data.id,
          listId: data.listId,
          description: data.description,
          completed: data.completed,
          createdAt: data.timestamp,
          updatedAt: data.timestamp,
        }
      }
      // Inserts item into DynamoDB table
      await dynamoDBService.create(params);
      return data.id;
    })
    .then((taskId) => {
      // Set Success Response
      response = new ResponseModel({ taskId }, 200, 'Task successfully added');
    })
    .catch((error) => {
      // Set Error Response
      response = (error instanceof ResponseModel) ? error : new ResponseModel({}, 500, 'Task could not be added');
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};