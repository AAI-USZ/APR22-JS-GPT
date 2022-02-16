var mongoose = require('mongoose').Mongoose,
Connection = require('./lib/connection').Connection,
Class = require('./util').Class;



mongoose.test = function(){
return this.connect('mongodb://localhost/test_' + (+new Date));
};

Connection.prototype.terminate = function(){
