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

// Mongoose models for our BarHopper entities
var User = require('./schemas/user');
var Patron = require('./schemas/patron');
var Bar = require('./schemas/bar');
var Promotion = require('./schemas/promotion');

// BarHopper MongoDB cluster hosted by mlab
var barHopperMongoClusterUrl = process.env.MONGODB_URI;

// Connect to database
mongoose.connect(barHopperMongoClusterUrl).then(
    () => {
        /* ready to use */
        console.log('DB connection alive')
    },
    err => { /* handle connection error */}
);

// -----------------------------------------------------------------------------
// Helpers

/**
 * createUser()
 *
 * Create userInfo in database then exec callback
 */
function createUser(userInfo, callback) {
    // build user from userInfo
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

            // set patron_id field in user object
            newUser.patron_id = patron._id;

            // save the user
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

/**
 * findUserByEmail()
 *
 * Searches user collection in db for user with matching email address.
 */
function findUserByEmail(email, callback) {
    User.findOne({ 'email': email }, function (err, user) {
        if (err) {
            callback(null);
            return;
        }
        callback(user);
    });
}


// -----------------------------------------------------------------------------
// Exports

module.exports = {
    'createUser' : createUser,
    'findUserByEmail': findUserByEmail
};
