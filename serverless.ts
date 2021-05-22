import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';

const serverlessConfiguration: AWS = {
  service: 'todo-list-api-ts',
  frameworkVersion: '2',
  custom: {
    region: '${opt:region, self:provider.region}',
    stage: '${opt:stage, self:provider.stage}',
    list_table: '${self:service}-list-table-${opt:stage, self:provider.stage}',
    task_table: '${self:service}-task-table-${opt:stage, self:provider.stage}',
    table_throughputs: {
      prod: 5,
      default: 1,
    },
    table_throughput: '${self:custom.TABLE_THROUGHPUTS.${self:custom.stage}, self:custom.table_throughputs.default}',
    dynamodb: {
      stages: ['dev'],
      start: {
        port: 8008,
        inMemory: true,
        heapInitial: '200m',
        heapMax: '1g',
        migrate: true,
        seed: true,
        convertEmptyValues: true,
      }
    },
    ['serverless-offline']: {
      httpPort: 3000,
      babelOptions: {
        presets: ["env"]
      }
    }
  },
  plugins: [
    'serverless-bundle',
    'serverless-offline',
    'serverless-dotenv-plugin',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      REGION: '${self:custom.region}',
      STAGE: '${self:custom.stage}',
      LIST_TABLE: '${self:custom.list_table}',
      TASK_TABLE: '${self:custom.task_table}',
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:DescribeTable',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem'
        ],
        Resource: [
          {"Fn::GetAtt": [ 'ListTable', 'Arn' ]},
          {"Fn::GetAtt": [ 'TaskTable', 'Arn' ]}
        ]
      }
    ]
  },
  functions: { hello },
  package: {
    individually: true,
  },
  resources: {
    Resources: {
      ListTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
        Properties: {
          TableName: '${self:provider.environment.LIST_TABLE}',
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' }
          ],
          KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: '${self:custom.TABLE_THROUGHPUT}',
            WriteCapacityUnits: '${self:custom.TABLE_THROUGHPUT}'
          }
        }
      },
      TaskTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
        Properties: {
          TableName: '${self:provider.environment.TASK_TABLE}',
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' },
            { AttributeName: 'listId', AttributeType: 'S' }
          ],
          KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' },
            { AttributeName: 'listId', KeyType: 'RANGE' }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: '${self:custom.TABLE_THROUGHPUT}',
            WriteCapacityUnits: '${self:custom.TABLE_THROUGHPUT}'
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
