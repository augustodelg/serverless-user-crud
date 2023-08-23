const aws = require('aws-sdk');
// const { makeUpdateParams } = require('./utils/makeUpdateParams');

let dynamodbClientParams = {};

if (process.env.IS_OFFLINE) {
    dynamodbClientParams = {
        region: 'localhost',
        endpoint: 'http://0.0.0.0:8000',
        accessKeyId: 'MockAccessKeyId',
        secretAccessKey: 'MockSecretAccessKey',
    }
}

const dynamodb = new aws.DynamoDB.DocumentClient(dynamodbClientParams);


const update = async (event, context) => {

    let userEmail = event.pathParameters.email;

    const body = JSON.parse(event.body)

    const params = makeUpdateParams('usersTable', userEmail, body)
    

    return dynamodb.update(params)
        .promise()
        .then(res => {
            console.log(res)
            return {
                "statusCode": 200,
                "body": JSON.stringify({ "user": res })
            }
        })
}

function makeUpdateParams(tableName, key, attributesToUpdate) {
    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};
    let UpdateExpression = "SET ";
  
    // For each attribute to update, add it to the UpdateExpression and build the ExpressionAttributeNames and ExpressionAttributeValues objects
    Object.entries(attributesToUpdate).forEach(
      ([attributeName, attributeValue]) => {
        const keyName = `#${attributeName}`;
        const valueName = `:${attributeName}`;
        UpdateExpression += `${keyName} = ${valueName}, `;
        ExpressionAttributeNames[keyName] = attributeName;
        ExpressionAttributeValues[valueName] = attributeValue;
      }
    );
  
    // Remove the trailing comma and space from the UpdateExpression
    UpdateExpression = UpdateExpression.slice(0, -2);
  
    // Build the params object with the tableName, key, UpdateExpression, and ExpressionAttributeNames and ExpressionAttributeValues objects
    const params = {
      TableName: tableName,
      Key: { email: key },
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: "ALL_NEW",
    };
  
    return params;
  }

module.exports = {
    update
}
