var EventEmitter = require('events').EventEmitter,
util = require('util'),
_ = require('underscore'),
Query = require('./query');

var Collection = module.exports = function(name, schema, parent, store){
this.name = name;
this.primary = store ? store._.primary : 1;
this.schema = schema;
this.store = store ? _.omit(store, '_') : {};
this.parent = parent;

this.__defineGetter__('length', function(){
return this.count();
});
};

util.inherits(Collection, EventEmitter);

Collection.prototype.count = function(){
return this.toArray().length;
};
