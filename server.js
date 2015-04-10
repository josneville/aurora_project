//Initialize server framework
var express = require('express');
var app = express();

var morgan = require('morgan'); //Used for logging server requests and responses
var bodyParser = require('body-parser'); //Used for parsing requests
var socket = require('socket.io'); //Used for having real-time data connection between website and server

// Run morgan and bodyParser on all incoming routes
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true})) ;  //Only parse urlencoded requests
app.use(bodyParser.json()) ;

var config = {
	GRAPHENEDB_URL: process.env.GRAPHENEDB_URL || 'http://neo4j:bananaman@localhost:7474'
}

process.env.config = JSON.stringify(config);

// Configure express to return static files
app.use(express.static("public"));

// Use routing table for all incoming routes
require('./app/routes/index')(app);

var port = process.env.PORT || 5000; //Either heroku will provide a port or use 5000
app.listen(port); //Run server
console.log("Server running on port: " + port);
