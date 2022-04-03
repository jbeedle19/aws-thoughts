// Load the AWS SDK
const AWS = require('aws-sdk');

// Set the region
AWS.config.update({ 
    region: 'us-east-2',
});

// Create the DynamoDB service object
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

// Create the params object that will hold the schema and metadata of the table
const params = {
    TableName: 'Thoughts',
    KeySchema: [
        { AttributeName: 'username', KeyType: 'HASH' }, // Partition key
        { AttributeName: 'createdAt', KeyType: 'RANGE' }, // Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: 'username', AttributeType: 'S' },
        { AttributeName: 'createdAt', AttributeType: 'N' },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
    },
};

// Call the DynamoDB instance and create the table
dynamodb.createTable(params, (err, data) => {
    if (err) {
        console.error(
            'Unable to create table. Error JSON:',
            JSON.stringify(err, null, 2),
        );
    } else {
        console.log(
            'Created table. Table description JSON:',
            JSON.stringify(data, null, 2),
        );
    }
});