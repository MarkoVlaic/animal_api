const uuid = require('uuid');
const AWS = require('aws-sdk');

const errorHandler = require('../errorHandler');

const dynamodb = new AWS.DynamoDB.DocumentClient();

/* Creates a new species in the table with parameters from event.body if there is no species with the same name in the table */

module.exports.addSpecies = (event, context, callback) => {
  const body = JSON.parse(event.body);
  console.log(body);

  const scanParams = {
    TableName: process.env.DYNAMODB_TABLE,
    FilterExpression: '#n <> :n',
    ExpressionAttributeNames: {
      '#n': 'name'
    },
    ExpressionAttributeValues: {
      ':n': body.name
    }
  }

  const insertParams = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      name: body.name,
      habitat: body.habitat,
      food: body.food,
      id: uuid.v1()
    }
  };

  dynamodb.scan(scanParams, (err, species) => {
    if(err)errorHandler(err, callback);
    if(!species || species.Items.length === 0){
      dynamodb.put(insertParams, err => {
        if(err)return errorHandler(err, callback)
        const response = {
          statusCode: 200,
          body: JSON.stringify(
            {
              message: `Successfully created ${body.name} species in the database`
            }
          )
        };

        return callback(null, response);
      });
    }else {
      const response = {
        statusCode: 304,
        body: JSON.stringify({
          message: `Species with name ${body.name} already exists`
        })
      };

      callback(null, response);
    }
  });
}
