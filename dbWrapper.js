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
var User = require('./schemas/user');
var Patron = require('./schemas/patron');
var Bar = require('./schemas/bar');
var Promotion = require('./schemas/promotion');

// BarHopper MongoDB cluster hosted by mlab
var barHopperMongoClusterUrl = // TODO use local .env file for MONGO_URI
  'mongodb://barhopperdbadmin:loluva140@ds121686.mlab.com:21686/barhopperdb';

mongoose.connect(barHopperMongoClusterUrl).then(
    () => {
        /* ready to use */
        console.log('DB connection alive')
    },
    err => { /* handle connection error */}
);

function userSignUp(userInfo) {
  var newUser = User({
    email: userInfo.email,
    password: userInfo.password,
    admin: userInfo.admin,
    patron_id: null,
    bar_id: null,
  });

  if (userInfo.admin) { // Map a new bar admin user to a bar
    var newBar = Bar({

    });
  }
  else { // Create a new patron account to map to the new user
    var newPatron = Patron({
      upvotes: [],
      barSubscriptions: [],
      promotionSubscriptions: [],
    });
    newPatron.save(function(err, patron){
      if (err) {
        console.log('Failed to save new patron to the DB.')
      }
      newUser.patron_id = patron._id;
      console.log(newUser);
    });
  }
}

function authenticateUser(userInfo) {

}

// BEGIN: Database Operations ---------------- //




// END: Database Operations ------------------ //

module.exports = {
    'userSignUp' : userSignUp,
};
