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
import requestConstraints from '../../constraints/list/update.constraint.json';

export const updateList: APIGatewayProxyHandler = (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = JSON.parse(event.body);

  // Initialise database service
  const dynamoDBService = new DynamoDBService();

  // Destructure environmental variable
  const { LIST_TABLE } = process.env;

  // Destructure request data
  const { listId, name } = requestData;

  // Validate against constraints
  return Promise.all([
    validateAgainstConstraints(requestData, requestConstraints),
    dynamoDBService.getItem({key: listId, tableName: LIST_TABLE})
  ])
    .then(() => {
      // Initialise DynamoDB UPDATE parameters
      const params = {
        TableName: LIST_TABLE,
        Key: {
          "id": listId
        },
        UpdateExpression: "set #name = :name, updatedAt = :timestamp",
        ExpressionAttributeNames: {
          "#name": "name"
        },
        ExpressionAttributeValues: {
          ":name": name,
          ":timestamp": new Date().getTime(),
        },
        ReturnValues: "UPDATED_NEW"
      }
      // Updates Item in DynamoDB table
      return dynamoDBService.update(params);
    })
    .then((results) => {
      // Set Success Response
      response = new ResponseModel({ ...results.Attributes }, 200, 'To-do list successfully updated');
    })
    .catch((error) => {
      // Set Error Response
      response = (error instanceof ResponseModel) ? error : new ResponseModel({}, 500, 'To-do list cannot be updated');
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};