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
var express    = require('express');
var app		   = express();
var path 	   = require('path');
var bodyParser = require('body-parser');

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


// -----------------------------------------------------------------------------
// Register routes
// all of our routes will be prefixed with /api
app.use('/api', router);


// -----------------------------------------------------------------------------
// Start
app.listen(port);
console.log('Magic happens on port ' + port);
