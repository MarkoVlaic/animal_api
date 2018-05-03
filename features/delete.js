const AWS = require('aws-sdk');
const errorHandler = require('../errorHandler');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.removeSpecies = (event, context, callback) => {
  const { species } = event.pathParameters;

  const scanParams = {
    TableName: process.env.DYNAMODB_TABLE,
    FilterExpression: '#n=:s',
    ExpressionAttributeNames: {
      '#n': 'name'
    },
    ExpressionAttributeValues: {
      ':s': species
    }
  };

  dynamodb.scan(scanParams, (err, data) => {
    if(err)errorHandler(err, callback);
    data.Items.forEach(item => {
      const deleteParams = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          id: item.id
        }
      };

      dynamodb.delete(deleteParams, (err, deleted) => {
        if(err)errorHandler(err, callback);
        const response = {
          statusCode: 200,
          body: JSON.stringify(deleted)
        };

        callback(null, response);
      });
    });
  });
}
