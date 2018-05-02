const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.addSpecies = (event, context, callback) => {
  const body = JSON.parse(event.body);
  console.log(body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      name: body.name,
      habitat: body.habitat,
      food: body.food,
      id: uuid.v1()
    }
  };

  dynamodb.put(params, err => {
    if(err)return callback(JSON.stringify(err), {statusCode: 500, body:{error: JSON.stringify(err)}});
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
}
