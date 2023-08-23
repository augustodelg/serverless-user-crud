const aws = require('aws-sdk');
const { log } = require('console');
const { randomUUID } = require('crypto');

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

const create = async (event, context) => {
    const id = randomUUID();

    const userBody = JSON.parse(event.body);

    const params = {
        TableName: 'usersTable',
        Item: {
            ...userBody,
            id
        },
    };
    console.log("PARAMS:", params);
    return dynamodb.put(params).promise().then((res) => {
        log("Dynamo Res:", res);
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "users": params.Item })
        }
    }).catch(err => {
        log("Dynamo Error:", err);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(err)
        };
    })
}



module.exports = {
    create,
}
