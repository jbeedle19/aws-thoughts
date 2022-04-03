// Load in .env file for S3 bucket name
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { v4: uuidv4 } = require('uuid');

const params = (fileName) => {
    const myFile = fileName.originalname.split('.');
    const fileType = myFile[myFile.length - 1];

    const imageParams = {
        Bucket: process.env.S3_BUCKET,
        Key: `${uuidv4()}.${fileType}`,
        Body: fileName.buffer,
    };

    return imageParams;
};

module.exports = params;