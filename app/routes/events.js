var GF = require('./globalFunctions');
var Agent = require('../models/agent');

module.exports = {
	new: function(req, res, next){
		var fromAgent = res.locals.fromAgent;
		var toAgent = res.locals.toAgent;
		var amount = req.body.event.amount;
		var eventType = req.body.event.eventType;
		var dateTime = req.body.event.dateTime;
		switch (eventType) {
			case "purchase":
				if (fromAgent.agentType != "person" || toAgent.agentType != "store"){
					GF.error(res, 400, "", "Mismatched event type");
					return;
				}
				break;
			case "refund":
				if (fromAgent.agentType != "store" || toAgent.agentType != "person"){
					GF.error(res, 400, "", "Mismatched event type");
					return;
				}
				break;
			case "personalLoan":
				if (fromAgent.agentType != "bank" || toAgent.agentType != "person"){
					GF.error(res, 400, "", "Mismatched event type");
					return;
				}
				break;
			case "personalLoanPayment":
				if (fromAgent.agentType != "person" || toAgent.agentType != "bank"){
					GF.error(res, 400, "", "Mismatched event type");
					return;
				}
				break;
			case "businessLoan":
				if (fromAgent.agentType != "bank" || toAgent.agentType != "store"){
					GF.error(res, 400, "", "Mismatched event type");
					return;
				}
				break;
			case "businessLoanPayment":
				if (fromAgent.agentType != "store" || toAgent.agentType != "bank"){
					GF.error(res, 400, "", "Mismatched event type");
					return;
				}
				break;
			default:
				GF.error(res, 400, "", "Mismatched event type");
				return;
				break;
		}
		if (fromAgent.worth - amount < 0){
			GF.error(res, 400, "", "Insufficient Funds");
			return;
		}
		Agent.createEvent(fromAgent, toAgent, amount, eventType, dateTime, function(err, result){
			if(err){
				GF.error(res, 400, err, "Unknown error");
				return;
			}
			fromAgent.worth = fromAgent.worth - amount;
			toAgent.worth = toAgent.worth + amount;
			fromAgent.save(function(err){
				if(err){
					GF.error(res, 400, err, "Unknown error");
					return;
				}
				toAgent.save(function(err){
					if(err){
						GF.error(res, 400, err, "Unknown error");
						return;
					}
					res.status(200).send({message: "Successfully added event"});
					return next();
				})
			})
		});
	},
	check: function(req, res, next){
		var postEvent = req.body.event;
		if (GF.checkEmptyObject(postEvent)){
			GF.error(res, 400, "", "No agent provided");
			return;
		}
		if (GF.checkEmptyParams([postEvent.amount, postEvent.dateTime, postEvent.fromAgent, postEvent.toAgent, postEvent.eventType])){
			GF.error(res, 400, "", "Events's attribute missing");
			return;
		}
		if (!(Number(postEvent.amount)===postEvent.amount && (postEvent.amount)%1===0)){
			GF.error(res, 400, "", "Events's amount must be a number");
			return;
		}
		return next();
	}
}
