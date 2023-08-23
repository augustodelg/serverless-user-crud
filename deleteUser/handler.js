const aws = require('aws-sdk');

let dynamodbClientParams;

if (process.env.IS_OFFLINE) {
    dynamodbClientParams = {
        region: 'localhost',
        endpoint: 'http://0.0.0.0:8000',
        accessKeyId: 'MockAccessKeyId',
        secretAccessKey: 'MockSecretAccessKey',
    }
}

const dynamodb = new aws.DynamoDB.DocumentClient(dynamodbClientParams);

const deleteUser = async (event, context) => {
    let email = event.pathParameters.email;
  
    let params = {
      TableName: "usersTable",
      Key: { email: email },
    };
  
    return dynamodb
      .delete(params)
      .promise()
      .then((response) => {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: "User deleted successfully" }),
        };
      });
  };
  

module.exports = {
    deleteUser,
}
