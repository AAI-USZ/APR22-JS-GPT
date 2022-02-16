var _ = require('underscore'),
Collection = require('./collection'),
Schema = require('./schema');

var Database = module.exports = function(){
this.store = {};
this.raw = {};
};

Database.prototype.collection = function(name, schema){
