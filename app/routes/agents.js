var GF = require('./globalFunctions');
var Agent = require('../models/agent');

module.exports = {
	new: function(req, res){
		var postAgent = req.body.agent;
		if (GF.checkEmptyObject(postAgent)){
			GF.error(res, 400, "", "No agent provided");
			return;
		}
		if (GF.checkEmptyParams([postAgent.worth, postAgent.name, postAgent.agentType])){
			GF.error(res, 400, "", "Agent attribute missing");
			return;
		}
		if (!(Number(postAgent.worth)===postAgent.worth && (postAgent.worth)%1===0)){
			GF.error(res, 400, "", "Agent	's worth must be a number");
			return;
		}
		Agent.create(postAgent, function (err, agent) {
        if (err){
					GF.error(res, 400, err, "Unknown Error");
					return;
				}
        res.status(200).send({message: "Agent added successfully"});
    });
	},
	multiple: function(req, res){
		var postAgents = req.body.agents;
		if (postAgents.isArray && postAgents.length == 0){
			GF.error(res, 400, "", "Cannot send empty array");
			return;
		}
		for (var i = 0; i < postAgents.length; i++){
				postAgent = postAgents[i];
				if (GF.checkEmptyObject(postAgent)){
					GF.error(res, 400, "", "No agent provided");
					return;
				}
				if (GF.checkEmptyParams([postAgent.worth, postAgent.name, postAgent.agentType])){
					GF.error(res, 400, "", "Agent "+i+"'s attribute missing");
					return;
				}
				if (!(Number(postAgent.worth)===postAgent.worth && (postAgent.worth)%1===0)){
					GF.error(res, 400, "", "Agent "+i+"'s worth must be a number");
					return;
				}
		}
		Agent.createMultiple(postAgents, function (err, agent) {
				if(err){
					GF.error(res, 400, err, "Unknown Error");
					return;
				}
				res.status(200).send({message: "Agents added"});
		});
	},
	fromAgent: function(req, res, next){
		Agent.get(req.body.event.fromAgent, function(err, agent){
			if(err){
				GF.error(res, 400, err, "FromAgent does not exist");
				return;
			}
			res.locals.fromAgent = agent;
			return next();
		});
	},
	toAgent: function(req, res, next){
		Agent.get(req.body.event.toAgent, function(err, agent){
			if(err){
				GF.error(res, 400, err, "ToAgent does not Exist");
				return;
			}
			res.locals.toAgent = agent;
			return next();
		});
	}
}
