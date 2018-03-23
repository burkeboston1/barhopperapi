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

// Signup new patron or
router.post('/signup', (req, res) => {
	dbWrapper.userSignUp(req.body, (user) => {
		if (!user) {
			res.status(400).json({success: false, message: 'Email already in use'});
		}
		const payload = {
			user_id: user.id
		};
		var token = jwt.sign(payload, process.env.SECRET), {
			expiresIn: 1440 // expires in 24 hours
		});
		res.status(201).json({success: true, message: 'User created', token: token});
	});
})


router.post('/authenticate', (req, res) => {

})



// -----------------------------------------------------------------------------
// Register routes
// all of our routes will be prefixed with /api
app.use('/api', router);


// -----------------------------------------------------------------------------
// Start
app.listen(port);
console.log('Magic happens on port ' + port);
