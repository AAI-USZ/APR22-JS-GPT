var EventEmitter = require('events').EventEmitter,
_ = require('underscore'),
Query = require('./query');

module.exports = function Collection(name, schema, parent, store){
this.name = name;
this.primary = store ? store._.primary : 1;
this.schema = schema;
this.store = store ? _.omit(store, '_') : {};
this.parent = parent;

