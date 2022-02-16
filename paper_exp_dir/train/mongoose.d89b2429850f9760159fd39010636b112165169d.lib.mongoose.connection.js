


var url = require('url')
, utils = require('./utils')
, EventEmitter = utils.EventEmitter
, driver = global.MONGOOSE_DRIVER_PATH || './drivers/node-mongodb-native'
, Model = require('./model')
, Schema = require('./schema')
, Collection  = require(driver + '/collection');



function Connection (base) {
this.base = base;
this.collections = {};
this.models = {};
};



Connection.prototype.__proto__ = EventEmitter.prototype;



Connection.prototype.readyState = 0;



Connection.prototype.collections;



Connection.prototype.db;



Connection.prototype.open = function (host, database, port, options, callback) {

var self = this
, uri;

if ('string' === typeof database) {
switch (arguments.length) {
case 2:
port = 27017;
case 3:
switch (typeof port) {
case 'function':
callback = port, port = 27017;
break;
case 'object':
options = port, port = 27017;
break;
}
break;
case 4:
if ('function' === typeof options)
callback = options, options = {};
}
} else {
switch (typeof database) {
case 'function':
callback = database, database = undefined;
break;
case 'object':
options = database;
database = undefined;
callback = port;
break;
}

uri = url.parse(host);
host = uri.hostname;
port = uri.port || 27017;
database = uri.pathname && uri.pathname.replace(/\
}

callback = callback || noop;
this.options = this.defaultOptions(options);


if (0 !== this.readyState) {
var err = new Error('Trying to open unclosed connection.');
err.state = this.readyState;
callback(err);
return this;
}

if (!host) {
callback(new Error('Missing connection hostname.'));
return this;
}

if (!database) {
callback(new Error('Missing connection database.'));
return this;
}


if (uri && uri.auth) {
var auth = uri.auth.split(':');
this.user = auth[0];
this.pass = auth[1];
} else {
this.user = this.pass = undefined;
}

this.name = database;
this.host = host;
this.port = port;


this.readyState = 2;
this.emit('opening');


this.doOpen(function (err) {
if (err) {
self.readyState = 0;
} else {
self.onOpen();
}

callback(err || null);
});

return this;
};



Connection.prototype.openSet = function (uris, database, options, callback) {
var uris = uris.split(',')
, self = this;

switch (arguments.length) {
case 3:
this.name = database;
if ('function' === typeof options) callback = options, options = {};
break;
case 2:
switch (typeof database) {
case 'string':
this.name = database;
case 'function':
callback = database, database = null;
break;
case 'object':
options = database, database = null;
break;
}
}

this.options = options = this.defaultOptions(options);
callback = callback || noop;

if (uris.length < 2) {
callback(new Error('Please provide comma-separated URIs'));
return this;
}

this.host = [];
this.port = [];

uris.forEach(function (uri) {
var uri = url.parse(uri);

self.host.push(uri.hostname);
self.port.push(uri.port || 27017);

if (!self.name && uri.pathname.replace(/\
self.name = uri.pathname.replace(/\

if (!self.user && uri.auth) {
var auth = uri.auth.split(':');
self.user = auth[0];
self.pass = auth[1];
}
});

if (!this.name) {
callback(new Error('No database name provided for replica set'));
return this;
}

this.readyState = 2;
this.emit('opening');


this.doOpenSet(function (err) {
if (err) {
self.readyState = 0;
} else {
self.onOpen();
}

callback(err || null);
});
};



Connection.prototype.onOpen = function () {
var self = this;

function open () {
self.readyState = 1;



for (var i in self.collections)
self.collections[i].onOpen();

self.emit('open');
};


if (self.user && self.pass)
self.db.authenticate(self.user, self.pass, open);
else
open();
};



Connection.prototype.close = function (callback) {
var self = this
, callback = callback || function(){};

switch (this.readyState){
case 0:
callback(null);
break;

case 1:
this.readyState = 3;
this.doClose(function(err){
if (err){
callback(err);
} else {
self.onClose();
callback(null);
}
});
break;

case 2:
this.once('open', function(){
self.close(callback);
});
break;

case 3:
this.once('close', function () {
callback(null);
});
break;
}

return this;
};



Connection.prototype.onClose = function () {
this.readyState = 0;



for (var i in this.collections)
this.collections[i].onClose();

this.emit('close');
};



Connection.prototype.collection = function (name) {
if (!(name in this.collections))
this.collections[name] = new Collection(name, this);
return this.collections[name];
};



Connection.prototype.model = function (name, schema, collection) {
if (!(schema instanceof Schema)) {
collection = schema;
schema = null;
}

collection || (collection = utils.toCollectionName(name));

if (!this.models[name]) {
var model = this.base.model(name, schema, collection, true)
, Model;

if (model.prototype.connection != this){
Model = function Model (){
model.apply(this, arguments);
};

Model.__proto__ = model;
Model.prototype.__proto__ = model.prototype;
Model.prototype.db = this;
Model.prototype.collection = this.collection(collection);
Model.init();
}

this.models[name] = Model || model;
}

return this.models[name];
};



Connection.prototype.setProfiling = function (level, ms, callback) {
if (1 !== this.readyState) {
return this.on('open', this.setProfiling.bind(this, level, ms, callback));
}

if (!callback) callback = ms, ms = 100;

var cmd = {};

switch (level) {
case 0:
case 'off':
cmd.profile = 0;
break;
case 1:
case 'slow':
cmd.profile = 1;
if ('number' !== typeof ms) {
ms = parseInt(ms, 10);
if (isNaN(ms)) ms = 100;
}
cmd.slowms = ms;
break;
case 2:
case 'all':
cmd.profile = 2;
break;
default:
return callback(new Error('Invalid profiling level: '+ level));
}

this.db.executeDbCommand(cmd, function (err, resp) {
if (err) return callback(err);

var doc = resp.documents[0];

err = 1 === doc.ok
? null
: new Error('Could not set profiling level to: '+ level)

callback(err, doc);
});
};



Connection.prototype.defaultOptions = function (options) {
var o = options || {};

o.server = o.server || {};

if (!('auto_reconnect' in o.server)) {
o.server.auto_reconnect = true;
}

o.db = o.db || {};
o.db.forceServerObjectId = false;

return o;
}



function noop () {}



module.exports = Connection;
