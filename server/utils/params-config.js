// Load in .env file for S3 bucket name
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { v4: uuidv4 } = require('uuid');

const params = (fileName) => {
    const myFile = fileName.originalname.split('.');
    const fileType = myFile[myFile.length - 1];

    const imageParams = {
        Bucket: 'user-images-765febd7-0f96-4c3d-a533-8b2a7fa9158a',
        Key: `${uuidv4()}.${fileType}`,
        Body: fileName.buffer,
        ACL: 'public-read'
    };

    return imageParams;
};

module.exports = params;