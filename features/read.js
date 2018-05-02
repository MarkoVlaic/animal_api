const AWS = require('aws-sdk');

module.exports.getSpecies = (event, context, callback) => {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Test passed'
      })
    };

    callback(null, response);
}
