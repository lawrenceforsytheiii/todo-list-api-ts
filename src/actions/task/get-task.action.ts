import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import 'source-map-support/register';
import ResponseModel from "../../models/response.model";
import DynamoDBService from "../../services/dynamodb.service";
import { validateAgainstConstraints } from "../../utils/util";
import requestConstraints from '../../constraints/task/get.constraint.json';

export const getTask: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
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
    .then((data) => {
      // Set Success Response
      response = new ResponseModel({ ...data.Item  }, 200, 'Task successfully retrieved');
    })
    .catch((error) => {
      // Set Error Response
      response = (error instanceof ResponseModel) ? error : new ResponseModel({}, 500, 'Task not found');
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};