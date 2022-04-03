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
