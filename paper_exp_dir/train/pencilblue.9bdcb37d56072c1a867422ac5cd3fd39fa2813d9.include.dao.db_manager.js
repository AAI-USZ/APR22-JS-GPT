


global.mongo    = require('mongodb').MongoClient;
global.format   = require('util').format;
global.ObjectID = require('mongodb').ObjectID;


global.mongoDB;


var DBManager = function() {


var dbs  = {};
var self = this;


this.getDB = function(name) {
var promise = new Promise();

if (dbs.hasOwnProperty(name)) {
log.debug("Providing cached instance of DB connection ["+name+"]");
promise.resolve(null, dbs[name]);
}
else{
var dbURL   = pb.config.db.servers[0] + name;
var options = {
w: pb.config.db.writeConcern
};

pb.log.debug("Attempting connection to: "+dbURL);
mongo.connect(dbURL, options, function(err, db){
