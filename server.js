/**
 * server.js
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

// Hello World route
router.get('/', (req, res) => {
	res.json({ message: 'Pee is stored in the balls'});
});