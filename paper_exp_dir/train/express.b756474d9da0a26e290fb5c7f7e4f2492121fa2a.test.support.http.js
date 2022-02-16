


var EventEmitter = require('events').EventEmitter
, http = require('http');

module.exports = request;

function request(app) {
return new Request(app);
}

function Request(app) {
var self = this;
this.data = [];
this.header = {};
this.app = app;
if (!this.server) {
this.server = http.Server(app);
this.server.listen(0, function(){
self.addr = self.server.address();
self.listening = true;
});
}
}



Request.prototype.__proto__ = EventEmitter.prototype;

Request.prototype.get = function(path){
return this.request('GET', path);
};

Request.prototype.head = function(path){
return this.request('HEAD', path);
};

Request.prototype.set = function(field, val){
this.header[field] = val;
return this;
};

Request.prototype.write = function(data){
