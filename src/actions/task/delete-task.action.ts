import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import 'source-map-support/register';
import ResponseModel from "../../models/response.model";
import DynamoDBService from "../../services/dynamodb.service";
import { validateAgainstConstraints } from "../../utils/util";
import requestConstraints from '../../constraints/task/delete.constraint.json';

export const deleteTask: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = JSON.parse(event.body);

  // Initialise database service
  const dynamoDBService = new DynamoDBService();

  // Destructure request data
  const { taskId, listId } = requestData;

  // Destructure process.env
  const { TASKS_TABLE } = process.env;

  // Validate against constraints
  return validateAgainstConstraints(requestData, requestConstraints)
    .then(() => {
      // Get item from the DynamoDB table
      // if it exists
      return dynamoDBService.getItem({
        key: taskId,
        hash: 'listId',
        hashValue: listId,
        tableName: TASKS_TABLE
      });
    })
    .then(() => {
      // Initialise DynamoDB DELETE parameters
      const params = {
        TableName: TASKS_TABLE,
        Key: {
          "id": taskId,
          "listId": listId
        },
      }
      // Delete task from db
      return dynamoDBService.delete(params);
    })
    .then(() => {
      // Set Success Response
      response = new ResponseModel({}, 200, 'Task successfully deleted');
    })
    .catch((error) => {
      // Set Error Response
      response = (error instanceof ResponseModel) ? error : new ResponseModel({}, 500, 'Task could not be deleted');
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};