/**
 * patron.js
 *
 * Mongoose schema definition for patrons
 *
 * BarHopper API
 * Will Campbell
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var patronSchema   = new Schema({
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'Promotion'}],
    barSubscriptions: [{ type: Schema.Types.ObjectId, ref: 'Bar'}],
    promotionSubscriptions: [{ type: Schema.Types.ObjectId, ref: 'Promotion'}],
});

var Patron = mongoose.model('Patron', patronSchema);
module.exports = Patron;
