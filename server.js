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
// Routes

/**
 * Middleware to allow cross origin requests.
 */
router.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, content-type, Accept');
	res.header('Access-Control-Allow-Methods', 'GET, POST');
	next();
})

// Base route
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
	req.body.admin = req.body.admin == 'true';
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
				desc_id: desc_id});
		}
	})
});


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
	        	return res.json({ success: false, message: 'Failed to authenticate token.' });
	      	} else {
	        	// if everything is good, save to request for use in other routes
	        	req.decoded = decoded;
	        	next();
	      	}
	    });
  	} else {
	    // return error if no token found in req
	    return res.status(403).json({success: false, message: 'No token provided.'});
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


// -----------------------------------------------------------------------------
// Register routes (prefix all with /api) and Start
app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);
