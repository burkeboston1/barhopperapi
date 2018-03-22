/**
 * bar.js
 *
 * Mongoose schema definition for bars
 *
 * BarHopper API
 * Will Campbell
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var barSchema   = new Schema({
    name: String,
    address: { type: String },
    phoneNumber: { type: String, unique: true },
    email: { type: String, unique: true },
    location: {
        type: { type: String },
        coordinates: [Number]
    }
});

barSchema.index({ "location": "2dsphere" });

var Bar = mongoose.model('Bar', barSchema);
module.exports = Bar;
