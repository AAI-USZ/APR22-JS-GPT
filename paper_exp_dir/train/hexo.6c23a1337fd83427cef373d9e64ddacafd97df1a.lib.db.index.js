var _ = require('underscore'),
Collection = require('./collection'),
Schema = require('./schema'),
Query = require('./query');

var Database = module.exports = function(){
this.store = {};
this.raw = {};
};

Database.prototype.collection = function(name, schema){
var store = this.store[name] = this.store[name] || new Collection(name, schema, this, this.raw[name]);
