/**
 * DB model for Promotions
 *
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var promotionSchema   = new Schema({
    name: String,
    description: String,
    bar_id: { type: Schema.Types.ObjectId, ref: 'Bar'},
    upvotes: { type: Number, default: 0 },
    startDate: Date,
    endDate: Date,
    location: {
        type: { type: String },
        coordinates: [Number],
    }
});

promotionSchema.index({ "location": "2dsphere" });

var Promotion = mongoose.model('Promotion', promotionSchema);
module.exports = Promotion;
