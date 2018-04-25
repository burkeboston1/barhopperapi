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
    phone: { type: String },
    email: { type: String },
    location: {
        type: { type: String },
        coordinates: [Number] 
    },
    logoUrl: String, 
    imageUrl: String
});

barSchema.index({ "location": "2dsphere" });

var Bar = mongoose.model('Bar', barSchema);
module.exports = Bar;
