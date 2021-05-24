import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import 'source-map-support/register';
import ListModel from "../../models/list.model";
import ResponseModel from "../../models/response.model";
import DynamoDBService from "../../services/dynamodb.service";
import { validateAgainstConstraints } from "../../utils/util";
import requestConstraints from '../../constraints/list/create.constraint.json';

export const createList: APIGatewayProxyHandler = (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;
  
  // Parse request parameters
  const requestData = JSON.parse(event.body);
  
  // Validate against constraints
  return validateAgainstConstraints(requestData, requestConstraints)
    .then(async () => {
      // Initialise database service
      const dynamoDBService = new DynamoDBService();
  
      // Initialise and hydrate model
      const listModel = new ListModel(requestData);
  
      // Get model data
      const data = listModel.getEntityMappings();
  
      // Initialise DynamoDB PUT parameters
      const params = {
        TableName: process.env.LIST_TABLE,
        Item: {
          id: data.id,
          name: data.name,
          createdAt: data.timestamp,
          updatedAt: data.timestamp,
        }
      };
      // Inserts item into DynamoDB table
      await dynamoDBService.create(params);
      return data.id;
    })
    .then((listId) => {
      // Set Success Response
      response = new ResponseModel({ listId }, 200, 'To-do list successfully created');
    })
    .catch((error) => {
      // Set Error Response
      response = (error instanceof ResponseModel) ? error : new ResponseModel({}, 500, 'To-do list cannot be created');
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};