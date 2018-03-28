/**
* dbWrapper.js
*
* Functions for interacting with BarHopper MongoDB
* cluster using mongoose to facilitate object modeling.
*
* BarHopper API
* Boston Burke, Will Campbell
*/

// Packages
var mongoose = require('mongoose');
var hash 	 = require('password-hash'); // for generating password hashes
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// Mongoose models for our BarHopper entities
var User      = require('./schemas/user');
var Patron    = require('./schemas/patron');
var Bar       = require('./schemas/bar');
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
    console.log(userInfo);
    var newUser = User({
        name: userInfo.name,
        email: userInfo.email,
        password: hash.generate(userInfo.password),
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
    } else {

        // save the user
        newUser.save(function(err, user){
            if(err) {
                console.log('Failed to write new user to DB.\n' + err);
                callback(null);
                return;
            }
            callback(user);
        });
    }
}

/**
* createBar()
*
* Create barInfo in database then exec callback.
*/
function createBar(barInfo, user_id, callback) {
    // get coordinates from address if not already provided
    var maps_url = 'https://maps.googleapis.com/maps/api/geocode/json?key='
        + process.env.MAPS_API_KEY          // Google Maps API key
        + '&address=' + barInfo.address;     // address
    httpGetAsync(maps_url, function(res) {
        // get the coordinates from the first result
        res = JSON.parse(res);
        var newBar = new Bar({
            name: barInfo.name,
            email: barInfo.email,
            address: barInfo.address,
            phone: barInfo.phone,
            location: {
                type: 'Point',
                coordinates: [res.results[0].geometry.location.lng, res.results[0].geometry.location.lat]
            }
        });

        // save bar in db
        newBar.save(function(err, bar) {
            if (err) {
                console.log('Failed to create bar.\n' + err);
                callback(null);
                return;
            }
            User.findOneAndUpdate({'_id' : user_id}, { $set: { 'bar_id':  bar._id} }, function(err, user) {
                if (err) {
                    console.log('Unable to find and update Bar Admin.');
                }
                callback(bar);
            });
        });
    });
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

/**
* createPromotion()
*
* Creates a new promotion in the database with the info provided by the client.
*/
function createPromotion(promoInfo, bar_id, callback) {
    // fill in promotion data with info supplied by client
    var newPromotion = new Promotion({
        name: promoInfo.name,
        description: promoInfo.description,
        bar_id: bar_id,
        upvotes: 0,
        startDate: new Date(promoInfo.startDate),
        endDate: new Date(promoInfo.endDate),
        location: {
            type: 'Point',
            coordinates: null,
        }
    });
    // find the associated bar so that promo's location can be set
    Bar.findOne({ '_id': bar_id }, function (err, bar) {
        if (err) {
            console.log('Error retrieving bar\'s location.');
            callback(null);
            return;
        }
        newPromotion.location.coordinates = bar.location.coordinates;
        // save new promotion to database
        newPromotion.save(function(err, promo) {
            if (err) {
                console.log('Failed to create new promotion.\n' + err);
                callback(null);
                return;
            }
            // return the successfully created promotion
            callback(newPromotion);
        });
    });
}

/**
* findPromotionsByLocation()
*
* Uses MongoDB Geonear functionality to find promotions near a given location.
*/
function findPromotionsByLocation(loc, callback) {
    var geoJSON = {
        type: 'Point',
        coordinates: loc
    };
    var options = {
        spherical: true,
        maxDistance: 1600
    };
    Promotion.geoNear(geoJSON, options, function(err, data, stats) {
        if (err) {
            console.log('Error retrieving promotions.');
            callback(null);
            return;
        }
        console.log(data);
        callback(data);        
    });
}

// -----------------------------------------------------------------------------
// Helper methods for this file
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}


// -----------------------------------------------------------------------------
// Exports

module.exports = {
    'createBar' : createBar,
    'createUser' : createUser,
    'createPromotion' : createPromotion,
    'findUserByEmail': findUserByEmail
};
