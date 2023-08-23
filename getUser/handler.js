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

const getAll= async (event, context) => {
    const params = {
        TableName: 'usersTable',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': "*"
        }
    };

    try {
        const data = await dynamodb.query(params).promise();
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "users": data.Items })
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(err)
        };
    }
}

module.exports = {
    getAll,
}
