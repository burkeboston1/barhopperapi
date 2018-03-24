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
var barHopperMongoClusterUrl = process.env.MONGODB_URI;

mongoose.connect(barHopperMongoClusterUrl).then(
    () => {
        /* ready to use */
        console.log('DB connection alive')
    },
    err => { /* handle connection error */}
);

function userSignUp(userInfo, callback) {
  var newUser = User({
    name: userInfo.name,
    email: userInfo.email,
    password: userInfo.password,
    admin: userInfo.admin,
    patron_id: null,
    bar_id: null,
  });

  if (!userInfo.admin) { // Create a new patron account to map to the new user
    var newPatron = Patron({
      upvotes: [],
      barSubscriptions: [],
      promotionSubscriptions: [],
    });
    newPatron.save(function(err, patron){
      if (err) {
        console.log('Failed to write new patron to DB.\n' + err);
        callback(null);
        return;
      }
      newUser.patron_id = patron._id;

      newUser.save(function(err, user){
        if(err) {
          console.log('Failed to write new user to DB.\n' + err);
          callback(null);
          return;
        }
        callback(user);
      });
    });
  } // end if
}

function userSignIn(userInfo, callback) {
    User.findOne({ 'email': userInfo.email }, function (err, user) {
        if (err) {
            callback(null);
            return;
        }
        callback(user);
    });
}

// BEGIN: Database Operations ---------------- //




// END: Database Operations ------------------ //

module.exports = {
    'userSignUp' : userSignUp,
    'userSignIn': userSignIn
};
