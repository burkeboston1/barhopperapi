/**
 * DB model for Patrons
 *
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var patronSchema   = new Schema({
    username: { type: String, unique: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'Promotion'}],
    barSubscriptions: [{ type: Schema.Types.ObjectId, ref: 'Bar'}],
    promotionSubscriptions: [{ type: Schema.Types.ObjectId, ref: 'Promotion'}],
});

var Patron = mongoose.model('Patron', patronSchema);
module.exports = Patron;
