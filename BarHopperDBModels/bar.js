/**
 * DB model for Bars
 *
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var barSchema   = new Schema({
    adminUserName: String,
    name: String,
    address: { type: String, unique: true },
    phoneNumber: { type: String, unique: true },
    emailAddress: { type: String, unique: true },
    location: {
        type: { type: String },
        coordinates: [Number],
        required: true,
    }
});

barSchema.index({ "location": "2dsphere" });

var Bar = mongoose.model('Bar', barSchema);
module.exports = Bar;
