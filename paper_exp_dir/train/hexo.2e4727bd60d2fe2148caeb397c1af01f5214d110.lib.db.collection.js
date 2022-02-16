var EventEmitter = require('events').EventEmitter,
util = require('util'),
_ = require('underscore'),
Query = require('./query');

function Collection(name, schema, parent, store){
this.name = name;
this.primary = store ? store._.primary : 1;
this.schema = schema;
this.store = store ? _.omit(store, '_') : {};
this.parent = parent;
this.index = [];

this.__defineGetter__('length', function(){
return this.toArray().length;
});
};

module.exports = Collection;
util.inherits(Collection, EventEmitter);

