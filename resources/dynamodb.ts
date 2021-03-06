export default {
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
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: 'list_index',
          KeySchema: [
            { AttributeName: 'listId', KeyType: 'HASH' },
          ],
          Projection: {
            ProjectionType: 'ALL' 
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: '${self:custom.TABLE_THROUGHPUT}',
            WriteCapacityUnits: '${self:custom.TABLE_THROUGHPUT}'
          },
        }
      ]
    }
  }
};