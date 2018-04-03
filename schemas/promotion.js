/**
 * promotion.js
 *
 * Mongoose schema definition for promotions
 *
 * BarHopper API
 * Will Campbell
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var promotionSchema   = new Schema({
    name: String,
    description: String,
    bar_id: { type: Schema.Types.ObjectId, ref: 'Bar'},
    barName: String,
    barAddress: String,
    upvotes: { type: Number, default: 0 },
    recurring: { type: Boolean, default: false },
    recurrence: {
        daysOfWeek: String,
        startTime: String,
        endTime: String
    },
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
