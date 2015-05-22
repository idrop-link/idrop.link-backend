(function() {
    'use strict';

    var path = require('path'),
        fs = require('fs');

    var STATIC_DATA_PATH = path.join('/static_data'),
        STATIC_DATA_PATH_ABS = path.join(__dirname, '..', STATIC_DATA_PATH),
        TEMP_UPLOAD_PATH = path.join(__dirname, '..', '/uploads');

    if (!fs.existsSync(STATIC_DATA_PATH_ABS))
        fs.mkdirSync(STATIC_DATA_PATH_ABS);

    if (!fs.existsSync(TEMP_UPLOAD_PATH))
        fs.mkdirSync(TEMP_UPLOAD_PATH);

    function save(filePath, subdir, cb) {
        var fileName = filePath.split('/').pop();

        var targetDir = path.join(STATIC_DATA_PATH, '/' + subdir),
            targetDirAbs = path.join(STATIC_DATA_PATH_ABS, '/' + subdir),
            targetPath = path.join(targetDir, '/' + fileName),
            targetPathAbs = path.join(targetDirAbs, '/' + fileName),
            tempPath = path.join(TEMP_UPLOAD_PATH, fileName);

        if (!fs.existsSync(targetDirAbs))
            fs.mkdirSync(targetDirAbs);

        // move file to destination
        fs.rename(tempPath, targetPathAbs, function(err) {
            cb(err, targetPath);
        });
    }

    function remove(filePath, cb) {
        fs.unlink(path.join(STATIC_DATA_PATH_ABS, '..', filePath), function(err) {
            // NOTE: the two '..' are needed, because both, the `STATIC_DATA_PATH_ABS`
            // and the `drop.path` already contain `static_data/`
            if (err) console.error('Unable to delete file: ' + path.join(STATIC_DATA_PATH_ABS, '..', drop.path) + '\n');
            cb(err);
        });
    }

    module.exports.save = save;
    module.exports.remove = remove;
})();
