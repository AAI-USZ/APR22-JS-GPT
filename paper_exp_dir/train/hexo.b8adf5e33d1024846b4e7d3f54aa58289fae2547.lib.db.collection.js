var EventEmitter = require('events').EventEmitter,
util = require('util'),
_ = require('underscore'),
Query = require('./query'),
single = require('./single');

function Collection(name, schema, parent, store){
this.name = name;
this.primary = store ? store._.primary : 1;
this.schema = schema;
this.store = store ? _.omit(store, '_') : {};
this.index = [];

this.__defineGetter__('parent', function(){
return parent;
