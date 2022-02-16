

var Connection = require('../../connection')
, mongo = require('mongodb')
, Server = mongo.Server
, ReplSetServers = mongo.ReplSetServers;



function NativeConnection() {
Connection.apply(this, arguments);
};



NativeConnection.prototype.__proto__ = Connection.prototype;



NativeConnection.prototype.doOpen = function (fn) {
var server;

if (!this.db) {
server = new mongo.Server(this.host, this.port, this.options.server);
this.db = new mongo.Db(this.name, server, this.options.db);
}

this.db.open(fn);

return this;
};



NativeConnection.prototype.doOpenSet = function (fn) {
if (!this.db) {
var servers = []
, ports = this.port;

this.host.forEach(function (host, i) {
servers.push(new mongo.Server(host, ports[i], this.options.server));
});

var server = new ReplSetServers(servers, this.options.replset);
this.db = new mongo.Db(this.name, server, this.options.db);
}

this.db.open(fn);

return this;
};



NativeConnection.prototype.doClose = function (fn) {
this.db.close();
if (fn) fn();
return this;
}



module.exports = NativeConnection;
