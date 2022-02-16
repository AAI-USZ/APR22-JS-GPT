var _ = require('underscore');

var Query = module.exports = function(store, parent){
this.store = store;
this.parent = parent;

this.__defineGetter__('length', function(){
return this.count();
});
};

Query.prototype.forEach = Query.prototype.each = function(iterator){
for (var i=0, len=this.store.length; i<len; i++){
iterator(this.store[i], this.store[i]._id);
}
