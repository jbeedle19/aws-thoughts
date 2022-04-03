const express = require('express');
const router = express.Router();

// Configure the service interface object
const AWS = require('aws-sdk');
const awsConfig = {
    region: 'us-east-2',
};
AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = 'Thoughts';

// GET all users' thoughts
router.get('/users', (req, res) => {
    const params = {
        TableName: table,
    };

    // Scan returns all items in the table
    dynamodb.scan(params, (err, data) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(data.Items);
        }
    });
});

// GET all thoughts from a single user
router.get('/users/:username', (req, res) => {
    console.log(`Querying for thought(s) from ${req.params.username}.`);
    // Set parameters for the query 
    const params = {
        TableName: table,
        KeyConditionExpression: '#un = :user',
        ExpressionAttributeNames: {
            '#un': 'username',
            '#ca': 'createdAt',
            '#th': 'thought',
            '#img': 'image'
        },
        ExpressionAttributeValues: {
            ':user': req.params.username,
        },
        ProjectionExpression: '#un, #th, #ca, #img',
        ScanIndexForward: false,
    };

    // Query the DB with above parameters
    dynamodb.query(params, (err, data) => {
        if (err) {
            console.error('Unable to query. Error:', JSON.stringify(err, null, 2));
            res.status(500).json(err);
        } else {
            console.log('Query succeeded.');
            res.json(data.Items)
        }
    });
});

// POST new user/thought
router.post('/users', (req, res) => {
    // Set POST parameters
    const params = {
        TableName: table,
        Item: {
            username: req.body.username,
            createdAt: Date.now(),
            thought: req.body.thought,
            image: req.body.image
        },
    };

    // Call and update the DB
    dynamodb.put(params, (err, data) => {
        if (err) {
            console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
            res.status(500).json(err);
        } else {
            console.log('Added item:', JSON.stringify(data, null, 2));
            res.json({ 'Added': JSON.stringify(data, null, 2) });
        }
    });
});

module.exports = router;