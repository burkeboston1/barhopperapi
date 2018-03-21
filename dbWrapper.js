/**
 * Functions for interacting with BarHopper MongoDB
 * cluster using mongoose to facilitate object modeling.
 *
 * BarHopper API
 * Boston Burke, Will Campbell
 */

var mongoose = require('mongoose');

// mongoose models for our BarHopper entities
var Patron = require('./BarHopperDBModels/patron');
var Bar = require('./BarHopperDBModels/bar');
var Promotion = require('./BarHopperDBModels/promotion');

// BarHopper MongoDB cluster hosted by mlab
var barHopperMongoClusterUrl = // TODO use local .env file for MONGO_URI
  'mongodb://barhopperdbadmin:loluva140@ds121686.mlab.com:21686/barhopperdb';

mongoose.connect(barHopperMongoClusterUrl);

// BEGIN: Database Operations ---------------- //




// END: Database Operations ------------------ //
