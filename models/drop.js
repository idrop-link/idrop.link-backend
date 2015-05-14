(function() {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var shortid = require('shortid');

    var DropSchema = new Schema({
        shortId: {
            type: String,
            unique: true,
            sparse: true,
            'default': shortid.generate
        },
        upload_date: {
            type: Date,
            default: Date.now
        },
        name: String,
        path: String,
        url: String,
        type: String
    });

    var Drop = mongoose.model('Drop', DropSchema);
    module.exports.DropSchema = DropSchema;
    module.exports.Drop = Drop;
})();
