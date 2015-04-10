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
    // relationships in one transaction and one network request:
    // (note that this'll still fail if there are any relationships attached
    // of any other types, which is good because we don't expect any.)
    var query = [
        'MATCH (agent:Agent)',
        'WHERE ID(agent) = {userId}',
        'DELETE agent',
        'WITH agent',
        'MATCH (agent) -[rel:*]- (other)',
        'DELETE rel',
    ].join('\n')

    var params = {
        userId: this.id
    };

    db.query(query, params, function (err) {
        callback(err);
    });
};

// static methods:

Agent.get = function (id, callback) {
    db.getNodeById(id, function (err, node) {
        if (err) return callback(err);
        callback(null, new Agent(node));
    });
};

Agent.getAll = function (callback) {
    var query = [
        'MATCH (agent:Agent)',
        'RETURN agent',
    ].join('\n');

    db.query(query, null, function (err, results) {
        if (err) return callback(err);
        var users = results.map(function (result) {
            return new Agent(result['agent']);
        });
        callback(null, users);
    });
};

// creates the agent and persists (saves) it to the db, incl. indexing it:
Agent.create = function (data, callback) {
    // construct a new instance of our class with the data, so it can
    // validate and extend it, etc., if we choose to do that in the future:
    var node = db.createNode(data);
    //var agent = new Agent(node);

    // but we do the actual persisting with a Cypher query, so we can also
    // apply a label at the same time. (the save() method doesn't support
    // that, since it uses Neo4j's REST API, which doesn't support that.)
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
    // but we do the actual persisting with a Cypher query, so we can also
    // apply a label at the same time. (the save() method doesn't support
    // that, since it uses Neo4j's REST API, which doesn't support that.)
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
