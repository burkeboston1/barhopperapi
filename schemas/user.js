/**
 * user.js
 *
 * Mongoose schema definition for users (either patron or bar admin)
 *
 * BarHopper API
 * Will Campbell
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var userSchema   = new Schema({
    name: { type: String },
    email: { type: String, unique: true },
    password: {type: String },
    admin: { type: Boolean },
    patron_id: { type: Schema.Types.ObjectId, ref: 'Patron' },
    bar_id: { type: Schema.Types.ObjectId, ref: 'Bar' }
});

var User = mongoose.model('User', userSchema);
module.exports = User;
