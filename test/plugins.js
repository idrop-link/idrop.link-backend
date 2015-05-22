(function() {
    'use strict';

    var should = require('chai').should,
        expect = require('chai').expect,
        assert = require('chai').assert,
        path = require('path'),
        fs = require('fs');

    var awsPlugin = require('../plugins/aws'),
        fsPlugin = require('../plugins/filesystem');

    var STATIC_DATA_PATH = path.join('/static_data'),
        STATIC_DATA_PATH_ABS = path.join(__dirname, '..', STATIC_DATA_PATH),
        TEMP_UPLOAD_PATH = path.join(__dirname, '..', '/uploads');

    if (!fs.existsSync(STATIC_DATA_PATH_ABS))
        fs.mkdirSync(STATIC_DATA_PATH_ABS);

    if (!fs.existsSync(TEMP_UPLOAD_PATH))
        fs.mkdirSync(TEMP_UPLOAD_PATH);

    var testFile = 'index.js',
        testFilePath = path.join(TEMP_UPLOAD_PATH, testFile),
        testSubdir = 'test',
        outPath = null;

    describe('File saving plugins:', function() {
        beforeEach(function() {
            // copy a file to the upload dir to test
            fs.createReadStream(testFile).pipe(fs.createWriteStream(testFilePath));
        });

        describe('Filesystem plugin', function() {
            it('should save a file', function(done) {
                fsPlugin.save(testFilePath, testSubdir, function(err, thePath) {
                    expect(err).to.equal(null);
                    expect(thePath).to.be.a('String');

                    outPath = thePath;
                    done();
                });
            });

            it('should remove the just saved file', function(done) {
                fsPlugin.remove(outPath, function(err) {
                    expect(err).to.equal(null);
                    done();
                });
            });
        });

        describe('Amazon Web Services - S3', function() {
            it('should save a file', function(done) {
                awsPlugin.save(testFilePath, testSubdir, function(err, thePath) {
                    expect(err).to.equal(null);
                    expect(thePath).to.be.a('String');

                    outPath = thePath;
                    done();
                });
            });

            it('should remove the just saved file', function(done) {
                awsPlugin.remove(outPath, function(err) {
                    expect(err).to.equal(null);
                    done();
                });
            });
        });
    });
})();
