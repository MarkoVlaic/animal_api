const AWS = require('aws-sdk');
const errorHandler = require('../errorHandler');

const dynamodb = new AWS.DynamoDB.DocumentClient();

/* Returns an array of all the species in the table */
module.exports.getAllSpecies = (event, context, callback) => {
  dynamodb.scan({TableName: process.env.DYNAMODB_TABLE}, (err, species) => {
    if(err)return errorHandler(err, callback);
    const response = {
      statusCode: 200,
      body: JSON.stringify(species.Items)
    };
    callback(null, response);
  });
}

/* Returns an array of species with name parameter equal to event.pathParameters.species */
module.exports.getSpecies = (event, context, callback) => {
    const { species } = event.pathParameters;

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      FilterExpression: `#nm = :n`,
      ExpressionAttributeNames: {
        '#nm': 'name'
      },
      ExpressionAttributeValues: {
        ':n': species
      }
    };

    dynamodb.scan(params, (err, species) => {
      if(err)return errorHandler(err, callback);
      const response = {
        statusCode: 200,
        body: JSON.stringify(species.Items)
      };
      callback(null, response);
    });

}
