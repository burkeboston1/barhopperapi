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
var dbWrapper  = require('./dbWrapper');
var jwt    	   = require('jsonwebtoken'); // used to create, sign, and verify tokens

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

// -----------------------------------------------------------------------------
// Routes

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
		}
		const payload = {
			user_id: user._id,
			admin: req.body.admin
		};
		var token = jwt.sign(payload, process.env.SECRET, {
			expiresIn: 1440 // expires in 24 hours
		});
		res.status(201).json({
			success: true,
			message: 'User created. Here\'s a token.', token: token});
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
		}
		if (req.body.password != user.password) {
			res.status(400).json({
				success: false,
				message: 'Authentication failed. Wrong password.'});
		}
		const payload = {
			user_id: user._id,
			admin: req.body.admin
		};
		var token = jwt.sign(payload, process.env.SECRET, {
			expiresIn: 1440 // expires in 24 hours
		});
		res.status(200).json({
			success: true,
			message: 'User signed in. Here\'s a token.', token: token});
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





// -----------------------------------------------------------------------------
// Register routes (prefix all with /api) and Start
app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);
