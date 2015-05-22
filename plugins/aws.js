(function() {
    'use strict';

    var AWS = require('aws-sdk'),
        fs = require('fs'),
        zlib = require('zlib'),
        mime = require('mime');

    var AWS_S3_BUCKET = process.env.AWS_S3_BUCKET,
        AWS_REGION = process.env.AWS_REGION;

    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    /*
     if (AWS_REGION)
        AWS.config.region = AWS_REGION;
    */
    var awsBasePath = 'https://' + AWS_S3_BUCKET + '.s3.amazonaws.com/';

    function save(filePath, subdir, cb) {
        var fileName = filePath.split('/').pop();

        // we create a stream to allow arbitrarily sized files
        var body = fs.createReadStream(filePath);//.pipe(zlib.createGzip());

        // this will be the file on s3 with `fileName` as key
        var s3 = new AWS.S3({
            params: {
                Bucket: AWS_S3_BUCKET,
                Key: fileName,
                ACL: 'public-read'
            }
        });

        s3
            .upload({
                Body: body
            })
            .send(function(err, data) {
                if (err) {
                    console.error(err);
                    cb(err, null);
                }

                fs.unlink(filePath, function (err) {
                    if (err) {
                        console.error(err);
                        cb(err, null);
                    }

                    cb(err, data.Location);
                });
            });
    }

    function remove(filePath, cb) {
        var fileName = filePath.split('/').pop();
        console.log('deleting ' + fileName);

        var s3 = new AWS.S3({
            params: {
                Bucket: AWS_S3_BUCKET,
                Key: fileName,
                ACL: 'public-read'
            }
        });

        s3.deleteObject({
            Bucket: AWS_S3_BUCKET,
            Key: fileName
        }, function(err, data) {
            if (err) console.error(err);
            cb(err);
        });
    }

    module.exports = {
        save: save,
        remove: remove
    };
})();
