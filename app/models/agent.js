// agent.js
// Agent model logic.

var neo4j = require('neo4j');
var config = JSON.parse(process.env.config);
var db = new neo4j.GraphDatabase(config.GRAPHENEDB_URL);

// private constructor:

var Agent = module.exports = function Agent(_node) {
    // all we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
}

// public instance properties:

Object.defineProperty(Agent.prototype, 'id', {
    get: function () { return this._node.id; }
});

Object.defineProperty(Agent.prototype, 'worth', {
    get: function () {
        return this._node.data['worth'];
    },
    set: function(worth) {
      this._node.data['worth'] = worth;
    }
});

Object.defineProperty(Agent.prototype, 'name', {
    get: function () {
        return this._node.data['name'];
    }
});

Object.defineProperty(Agent.prototype, 'agentType', {
    get: function () {
        return this._node.data['agentType'];
    }
});

// public instance methods:

Agent.prototype.save = function (callback) {
    this._node.save(function (err) {
        callback(err);
    });
};

Agent.prototype.del = function (callback) {
    // use a Cypher query to delete both this agent and his/her following
    // relationships in one transaction and one network request.
    var query = [
        'MATCH (agent:Agent)-[r]-()',
        'WHERE NAME(agent) = {name}',
        'DELETE agent, r'
    ].join('\n')

    var params = {
        name: this.name
    };

    db.query(query, params, function (err) {
        callback(err);
    });
};

Agent.createEvent = function (a, b, amount, relType, callback){
    var query = [
      'MATCH (a:Agent), (b:Agent)',
      'WHERE a.name = {aName} AND b.name = {bName}',
      'CREATE (a)-[r:'+relType+' {amount: {amount}}]->(b)',
      'return r'
    ].join('\n');

    var params = {
      aName: a.name,
      bName: b.name,
      amount: amount
    };

    db.query(query, params, function (err, results) {
        if (err){
          return callback(err, null);
        }
        callback(null, null);
    });
}

// static methods

Agent.get = function (name, callback) {
    var query = [
      'MATCH (agent:Agent)',
      'WHERE agent.name = {name}',
      'RETURN agent'
    ].join('\n');
    var params = {
      name: name
    }
    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        callback(null, new Agent(results[0]['agent']));
    });
};

Agent.getAll = function (callback) {
    var query = [
        'MATCH (agent:Agent)',
        'RETURN agent',
    ].join('\n');

    db.query(query, null, function (err, results) {
        if (err) return callback(err);
        var agents = results.map(function (result) {
            return new Agent(result['agent']);
        });
        callback(null, agents);
    });
};

// creates the agent and persists (saves) it to the db, incl. indexing it:
Agent.create = function (data, callback) {
    var query = [
        'CREATE (agent:Agent {data})',
        'RETURN agent',
    ].join('\n');

    var params = {
        data: data
    };

    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var agent = new Agent(results[0]['agent']);
        callback(null, agent);
    });
};

Agent.createMultiple = function (data, callback) {
    var query = [
        'CREATE (agent:Agent {data})',
        'RETURN agent',
    ].join('\n');

    var params = {
        data: data
    };
    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var agents = results.map(function (result) {
            return new Agent(result['agent']);
        });
        callback(null, agents);
    });
};
