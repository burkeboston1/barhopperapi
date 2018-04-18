/**
 * server.js
 *
 * Main server file for the BarHopper API
 *
 * BarHopper API
 * Boston Burke, Will Campbell
 */

// -----------------------------------------------------------------------------
// Config
require('dotenv').config();
var express    = require('express');
var app		   = express();
var path 	   = require('path');
var bodyParser = require('body-parser');
var dbWrapper  = require('./dbWrapper');  // database helper file
var jwt    	   = require('jsonwebtoken'); // used to create, sign, and verify tokens
var hash 	   = require('password-hash'); // for verifying passwords
var cors	   = require('cors');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

app.use(cors());
app.options('*', cors());

// -----------------------------------------------------------------------------
// Open Routes

/**
 * Middleware to allow cross origin requests.
 */
router.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, content-type, Accept');
	res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH');
	next();
})

/**
 * /api/
 *
 * Just the welcome route.
 */
router.get('/', (req, res) => {
	res.status(200).json({message: 'Welcome to the BarHopper API'});
});

/**
 * /api/signup
 *
 * Creates a new user (patron or bar manager) with information in req.body
 * and returns a token upon success.
 */
router.post('/signup', (req, res) => {
	req.body.admin = req.body.admin == 'true' || req.body.admin;
	dbWrapper.createUser(req.body, (user) => {
		if (!user) {
			res.status(400).json({
				success: false,
				message: 'Sign up failed. Email already in use.'});
		} else {
			const payload = {
				user_id: user._id,
				admin: user.admin
			};
			var token = jwt.sign(payload, process.env.SECRET, {
				expiresIn: 1440 // expires in 24 hours
			});
			var desc_id = user.admin ? user.bar_id : user.patron_id // reference to corresponding patron/bar
			res.status(201).json({
				success: true,
				message: 'User created. Here\'s a token.',
				token: token,
				desc_id : desc_id});
		}
	});
})

/**
 * /api/authenticate
 *
 * Returns a token if req.body.user exists and req.body.password matches
 * password returned by database.
 */
router.post('/authenticate', (req, res) => {
	dbWrapper.findUserByEmail(req.body.email, (user) => {
		if (!user) {
			res.status(400).json({
				success: false,
				message: 'Authentication failed. User not found.'});
		} else if (!hash.verify(req.body.password, user.password)) {
			res.status(400).json({
				success: false,
				message: 'Authentication failed. Wrong password.'});
		} else {
			const payload = {
				user_id: user._id,
				admin: user.admin
			};
			var token = jwt.sign(payload, process.env.SECRET, {
				expiresIn: 1440 // expires in 24 hours
			});
			var desc_id = user.admin ? user.bar_id : user.patron_id // reference to corresponding patron/bar
			res.status(200).json({
				success: true,
				message: 'User signed in. Here\'s a token.',
				token: token,
				user_id: user._id,
				desc_id: desc_id});
		}
	})
});

/**
 * /api/verify
 * 
 * Attemps to authenticate an unverified bar manager user using req.body.email 
 * and req.body.password. On success, updates the returned user object with new
 * name and password. 
 */
router.post('/verify', (req, res) => { 
	dbWrapper.findUserByEmail(req.body.email, (user) => {
		if (!user) {
			res.status(400).json({
				success: false,
				message: 'Verification failed. User not found.'});
		} else if (!user.admin) {
			res.status(403).json({
				success: false,
				message: 'Verification failed. User not authorized.'});
		} else if (user.verified) {
			res.status(403).json({
				success: false,
				message: 'Verification failed. User already verified.'});
		} else if (!hash.verify(req.body.tempPassword, user.password)) {
			res.status(400).json({
				success: false,
				message: 'Verification failed. Wrong temporary password.'});
		} else {
			dbWrapper.updateUser(user._id, req.body, (err) => {
				if (err) {
					res.status(400).json({
						success: false, 
						message: 'Verification failed. Failed to update user info.'
					});
				} else {
					const payload = {
						user_id: user._id,
						admin: user.admin
					};
					var token = jwt.sign(payload, process.env.SECRET, {
						expiresIn: 1440 // expires in 24 hours
					});
					var desc_id = user.admin ? user.bar_id : user.patron_id // reference to corresponding patron/bar
					res.status(200).json({
						success: true,
						message: 'User verified. Here\'s a token.',
						token: token,
						user_id: user._id,
						desc_id: desc_id});
				}
			});
		}
	})
})

/**
 * /api/bars/:bar_id
 *
 * Gets the bar object associated with a given bar_id.
 */
router.get('/bars/:bar_id', (req, res) => {
	dbWrapper.findBar(req.params.bar_id, (barObj) => {
		if (!barObj) {
			res.status(403).json({success: false,
				message: 'Failed to retrieve a bar matching the given bar_id.',
			});
		} else {
			res.status(200).json({success: true,
				message: 'Here\'s a bar.',
				bar: barObj
			});
		}
	});
});

/**
 * /api/promotions/loc/:location
 *
 * Gets all promotions within a radius around the given location ([lng, lat]).
 */
router.get('/promotions/loc/:location', (req, res) => {
	var coords = JSON.parse(req.params.location);
	dbWrapper.findPromotionsByLocation(coords, (promos) => {
		res.status(200).json({success: true,
			message: 'Here\'s some promotions',
			results: promos});
	});
});

/**
 * /api/bars/loc/:location
 *
 * Gets all bars within a radius around the given location ([lng, lat]).
 */
router.get('/bars/loc/:location', (req, res) => {
	var coords = JSON.parse(req.params.location);
	dbWrapper.findBarsByLocation(coords, (bars) => {
		res.status(200).json({success: true,
			message: 'Here\'s some bars.',
			results: bars});
	});
});

/**
 * /api/promotions/bar/:bar_id
 *
 * Gets all promotions associated with a given bar_id.
 */
router.get('/promotions/bar/:bar_id', (req, res) => {
	dbWrapper.findPromotionsByBar(req.params.bar_id, (promos) => {
		res.status(200).json({success: true,
			message: 'Here\'s some promotions',
			results: promos});
	});
});

// -----------------------------------------------------------------------------
// Protected Routes

/**
 * Middleware to protect subsequent routes.
 *
 * NOTE: Declaration order matters. Routes declared after the following
 * use() will be protected by auth tokens.
 */
router.use((req, res, next) => {
	// check for token in req
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
  	if (token) {
	    // verify secret and checks exp
	    jwt.verify(token, process.env.SECRET, function(err, decoded) {
	     	if (err) {
	        	return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
	      	} else {
	        	// if everything is good, save to request for use in other routes
	        	req.decoded = decoded;
	        	next();
	      	}
	    });
  	} else {
	    // return error if no token found in req
	    return res.status(401).json({success: false, message: 'No token provided.'});
  	}
});

/**
 * /api/newbar
 *
 * Create new bar with info in req.body and map to user found in token payload.
 */
router.post('/newbar', (req, res) => {
	 // check that user is admin
	 console.log(req.decoded);
	 if (!req.decoded.admin) {
		 res.status(403).json({success: false, message: 'User not authorized to create bar.'});
	 } else {
		 // TODO: verify that bar manager is associated with bar they are trying to create
		 dbWrapper.createBar(req.body, req.decoded.user_id, (bar, err) => {
			 if (!bar) {
				 // TODO: handle different errors
				 res.status(400).json({success: false, message: 'Failed to create bar.'});
			 } else {
			 	 res.status(201).json({success: true, message: 'Bar created.', bar_id: bar._id});
		 	 }
		 });
 	}
 })

/**
* /api/newpromo
*
* Create new promotion with info in req.body.
*/
router.post('/newpromo', (req, res) =>{
	if (!req.decoded.admin) {
		res.status(403).json({success: false, message: 'User not authorized to create promotion.'});
	} else {
		dbWrapper.createPromotion(req.body, req.body.bar_id, (promo) => {
			if (!promo) {
				res.status(400).json({success: false, message: 'Failed to create promotion.'});
			} else {
				res.status(201).json({success: true, message: 'Promotion created.', promo_id: promo._id});
			}
		 });
 	}
});

/**
 * /api/promotion/:promo_id
 * 
 * Update promotion with promo_id with new info in req.body.
 */
router.patch('/promotions/:promo_id', (req, res) => {
	if (!req.decoded.admin) {
		res.status(403).json({success: false, message: 'User not authorized to edit promotion.'})
	} else {
		dbWrapper.updatePromotion(req.params.promo_id, req.body, (err, promotion) => {
			if (err){
				console.log(err);
				res.status(400).json({success: false, message: 'Promotion does not exist.'});
			} else {
				res.status(200).json({success: true, message: 'Promotion updated.', promotion: promotion});
			}
		})
	}
})

/**
 * /api/promotion/:promo_id
 *
 * Delete the promotion with the promo_id.
 */
router.delete('/promotions/:promo_id', (req, res) => {
	if (!req.decoded.admin) {
		res.status(403).json({success: false, message: 'User not authorized to create promotion.'})
	} else {
		dbWrapper.deletePromotion(req.params.promo_id, (err) => {
			if (err) {
				res.status(400).json({success: false, message: 'Promotion does not exist.'});
			} else {
				res.status(200).json({success: true, message: 'Promotion deleted.'});
			}
		})
	}
})


// -----------------------------------------------------------------------------
// Register routes (prefix all with /api) and Start
app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);
