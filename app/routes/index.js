module.exports = function(app, io){
	var agents = require('./agents');
	var events = require('./events');
	var socket = require('../sockets/index')(io);

	socket.init();

	// Routes
	app.post('/agent', agents.new, socket.emit);
	app.post('/agents', agents.multiple, socket.emit);
	app.post('/event', events.check, agents.fromAgent, agents.toAgent, events.new, socket.emit);
}
