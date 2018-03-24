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

// Signup new patron or bar manager
router.post('/signup', (req, res) => {
	req.body.admin = req.body.admin == "true";
	dbWrapper.userSignUp(req.body, (user) => {
		if (!user) {
			res.status(400).json({success: false, message: 'Email already in use'});
		}
		const payload = {
			user_id: user._id
		};
		var token = jwt.sign(payload, process.env.SECRET, {
			expiresIn: 1440 // expires in 24 hours
		});
		res.status(201).json({success: true, message: 'User created', token: token});
	});
})

// Sign in as patron or bar manager
router.post('/authenticate', (req, res) => {
	dbWrapper.userSignIn(req.body, (user) => {
		if (!user) {
			res.status(400).json({success: false, message: 'Email does not exist'});
		}
		if (req.body.password != user.password) {
			res.status(400).json({success: false, message: 'Password does not match'});
		}
		const payload = {
			user_id: user._id
		};
		var token = jwt.sign(payload, process.env.SECRET, {
			expiresIn: 1440 // expires in 24 hours
		});
		res.status(200).json({success: true, message: 'User signed in', token: token});
	})
});

// Sign out as patron or bar manager




// -----------------------------------------------------------------------------
// Register routes
// all of our routes will be prefixed with /api
app.use('/api', router);


// -----------------------------------------------------------------------------
// Start
app.listen(port);
console.log('Magic happens on port ' + port);
