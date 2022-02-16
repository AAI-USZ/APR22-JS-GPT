


var Schema = require('./schema')
, SchemaType = require('./schematype')
, VirtualType = require('./virtualtype')
, SchemaTypes = Schema.Types
, SchemaDefaults = require('./schemadefault')
, Types = require('./types')
, Query = require('./query')
, Promise = require('./promise')
, Model = require('./model')
, Document = require('./document')
, utils = require('./utils');



function Mongoose () {
this.connections = [];
this.plugins = [];
this.models = {};
this.modelSchemas = {};
this.options = {};
this.createConnection();
};



Mongoose.prototype.set =
Mongoose.prototype.get = function (key, value) {
if (arguments.length == 1)
return this.options[key];
this.options[key] = value;
return this;
};



Mongoose.prototype.createConnection = function () {
var conn = new Connection(this);
this.connections.push(conn);
if (arguments.length)
conn.open.apply(conn, arguments);
return conn;
};



Mongoose.prototype.createSetConnection = function () {
var conn = new Connection(this);
this.connections.push(conn);
if (arguments.length)
conn.openSet.apply(conn, arguments);
return conn;
};



Mongoose.prototype.connect = function (){
this.connection.open.apply(this.connection, arguments);
return this;
};



Mongoose.prototype.connectSet = function (){
this.connection.openSet.apply(this.connection, arguments);
return this;
};



Mongoose.prototype.disconnect = function (fn) {
var count = this.connections.length;
this.connections.forEach(function(conn){
conn.close(function(err){
if (err) return fn(err);
if (fn)
--count || fn();
});
});
return this;
};



Mongoose.prototype.model = function (name, schema, collection, skipInit) {

if (!(schema instanceof Schema)) {
collection = schema;
schema = false;
}

if ('boolean' === typeof collection) {
skipInit = collection;
collection = null;
}

collection || (collection = utils.toCollectionName(name));


if (!this.modelSchemas[name]) {
if (name in SchemaDefaults) {
schema = SchemaDefaults[name];
}

if (schema) {
this.modelSchemas[name] = schema;
for (var i = 0, l = this.plugins.length; i < l; i++) {
schema.plugin(this.plugins[i][0], this.plugins[i][1]);
}
} else {
throw new Error('Schema hasn\'t been registered for model "' + name + '".\n'
+ 'Use mongoose.model(name, schema)');
}
}

if (!this.models[name]) {
var model = Model.compile(name
, this.modelSchemas[name]
, collection
, this.connection
, this);

if (!skipInit) model.init();

this.models[name] = model;
}

return this.models[name];
};



Mongoose.prototype.plugin = function (fn, opts) {
this.plugins.push([fn, opts]);
return this;
};



Mongoose.prototype.__defineGetter__('connection', function(){
return this.connections[0];
});



var compat = false;

exports.__defineGetter__('compat', function(){
return compat;
});

exports.__defineSetter__('compat', function(v){
compat = v;
if (v) require('./compat');
});



var driver = global.MONGOOSE_DRIVER_PATH || './drivers/node-mongodb-native';



var Connection = require(driver + '/connection');



var Collection = require(driver + '/collection');



module.exports = exports = new Mongoose();



exports.Collection = Collection;



exports.Connection = Connection;



exports.version = '1.7.2';



exports.Mongoose = Mongoose;



exports.Schema = Schema;



exports.SchemaType = SchemaType;



exports.VirtualType = VirtualType;



exports.SchemaTypes = SchemaTypes;



exports.Types = Types;



exports.Query = Query;



exports.Promise = Promise;



exports.Model = Model;



exports.Document = Document;



exports.Error = require('./error');

exports.mongo = require('mongodb');
