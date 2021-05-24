import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import 'source-map-support/register';
import ResponseModel from "../../models/response.model";
import DynamoDBService from "../../services/dynamodb.service";
import { validateAgainstConstraints } from "../../utils/util";
import requestConstraints from '../../constraints/task/update.constraint.json';

export const updateTask: APIGatewayProxyHandler = (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = JSON.parse(event.body);

  // Initialise database service
  const dynamoDBService = new DynamoDBService();
  
  // Destructure request data
  const { listId, taskId, completed, description } = requestData;

  // Destructure process.env
  const { LIST_TABLE, TASKS_TABLE } = process.env;

  return Promise.all([
    // Validate against constraints
    validateAgainstConstraints(requestData, requestConstraints),
    // Get item from the DynamoDB table
    dynamoDBService.getItem({ key: listId, tableName: LIST_TABLE })
  ])
    .then(() => {
      // Optional completed parameter
      const isCompletedPresent = typeof completed !== 'undefined';

      // Initialise the update expression
      const updateExpression = `set ${description ? 'description = :description,' : ''} ${typeof completed !== 'undefined' ? 'completed = :completed,' : ''} updatedAt = :timestamp`;

      // Ensures at least one optional parameter is present
      if (description || isCompletedPresent) {
        // Initialise DynamoDB UPDATE parameters
        const params = {
          TableName: TASKS_TABLE,
          Key: {
            "id": taskId,
            "listId": listId
          },
          UpdateExpression: updateExpression,
          ExpressionAttributeValues: {
            ":timestamp": new Date().getTime(),
          },
          ReturnValues: "UPDATED_NEW"
        };
        // Set optional values only if present
        if (description) {
          params.ExpressionAttributeValues[':description'] = description;
        }
        if (isCompletedPresent) {
          params.ExpressionAttributeValues[':completed'] = completed;
        }

        // Updates item in DynamoDB table
        return dynamoDBService.update(params);
      }
      // Throws error if none of the optional parameters is present
      throw new ResponseModel({}, 400, 'Invalid Request!');
    })
    .then((results) => {
      // Set Success Response
      response = new ResponseModel({ ...results.Attributes }, 200, 'Task successfully updated');
    })
    .catch((error) => {
      // Set Error Response
      response = (error instanceof ResponseModel) ? error : new ResponseModel({}, 500, 'Task could not be updated');
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};