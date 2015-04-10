var agents = require('./agents');
var events = require('./events');

module.exports = function(app){
	app.post('/agent', agents.new);
	app.post('/agents', agents.multiple);
	app.post('/event', events.check, agents.fromAgent, agents.toAgent, events.new);
}
