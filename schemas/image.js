/**
 * image.js
 * 
 * Mongoose schema definition for images
 * 
 * BarHopper API
 * Boston Burke 
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var imageSchema = new Schema({
    img: {
        data: Buffer, contentType: String
    },
    type: String
})

var Image = mongoose.model('Image', imageSchema);
module.exports = Image;