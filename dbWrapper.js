/**
 * dbWrapper.js
 *
 * Functions for interacting with BarHopper MongoDB
 * cluster using mongoose to facilitate object modeling.
 *
 * BarHopper API
 * Boston Burke, Will Campbell
 */

var mongoose = require('mongoose');

// mongoose models for our BarHopper entities
var Patron = require('./schemas/patron');
var Bar = require('./schemas/bar');
var Promotion = require('./schemas/promotion');

// BarHopper MongoDB cluster hosted by mlab
var barHopperMongoClusterUrl = process.env.MONGODB_URI;

mongoose.connect(barHopperMongoClusterUrl).then(
    () => {
        /* ready to use */
        console.log('DB connection alive')
    },
    err => { /* handle connection error */}
);

function getBarById(barId) {

}

// BEGIN: Database Operations ---------------- //




// END: Database Operations ------------------ //

module.exports = {
    'getBarById' : getBarById
};
