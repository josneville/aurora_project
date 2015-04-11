var Agent = require('../models/agent');

module.exports = function(io){
  return {
    init: function(){
      io.on('connection', function(socket){
        Agent.getAllSingle(function(err, rNodes){
          nodes = [];
          for (var i = 0; i < rNodes.length; i++){
            nodes.push({name: rNodes[i].n._data.data.name, agentType: rNodes[i].n._data.data.agentType, worth: rNodes[i].n._data.data.worth});
          }
          Agent.getAllConnected(function(err, rLinks){
            links = [];
            for (var i = 0; i < rLinks.length; i++){
              links.push({
                source: rLinks[i].n._data.data.name,
                sw: rLinks[i].n._data.data.worth,
                sa: rLinks[i].n._data.data.agentType,
                target: rLinks[i].m._data.data.name,
                tw: rLinks[i].m._data.data.worth,
                ta: rLinks[i].m._data.data.agentType,
                type: rLinks[i].r._data.metadata.type,
                amount: rLinks[i].r._data.data.amount,
                dateTime: rLinks[i].r._data.data.dateTime
              });
            }
            socket.emit('data', {links: links, nodes: nodes});
          })
        });
      });
    },
    emit: function(){
      Agent.getAllSingle(function(err, rNodes){
        nodes = [];
        for (var i = 0; i < rNodes.length; i++){
          nodes.push({name: rNodes[i].n._data.data.name, agentType: rNodes[i].n._data.data.agentType, worth: rNodes[i].n._data.data.worth});
        }
        Agent.getAllConnected(function(err, rLinks){
          links = [];
          for (var i = 0; i < rLinks.length; i++){
            links.push({
              source: rLinks[i].n._data.data.name,
              sw: rLinks[i].n._data.data.worth,
              sa: rLinks[i].n._data.data.agentType,
              target: rLinks[i].m._data.data.name,
              tw: rLinks[i].m._data.data.worth,
              ta: rLinks[i].m._data.data.agentType,
              type: rLinks[i].r._data.metadata.type,
              amount: rLinks[i].r._data.data.amount,
              dateTime: rLinks[i].r._data.data.dateTime
            });
          }
          io.emit('data', {links: links, nodes: nodes});
        })
      });
    }
  }
}
