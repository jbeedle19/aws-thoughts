const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const paramsConfig = require('../utils/params-config');

// Create a temporary storage container
const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '');
    },
});

// Declare the upload object using image as the key
const upload = multer({ storage }).single('image');

// Instantiate the service object, s3, to communicate with S3 service
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
});

// POST new image
router.post('/image-upload', upload, (req, res) => {
    console.log('post("/api/image-upload"', req.file);
    // Set up the parameters
    const params = paramsConfig(req.file);
    
    // Set up the S3 service call
    s3.upload(params, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        }
        res.json(data);
    });
});

module.exports = router;