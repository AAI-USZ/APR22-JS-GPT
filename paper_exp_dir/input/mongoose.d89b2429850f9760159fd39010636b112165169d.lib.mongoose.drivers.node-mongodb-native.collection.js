


var Collection = require('../../collection')
, MongoCollection = require('mongodb').Collection;



function NativeCollection () {
Collection.apply(this, arguments);
};



NativeCollection.prototype.__proto__ = Collection.prototype;



NativeCollection.prototype.onOpen = function () {
var self = this;
this.conn.db.collection(this.name, function(err, collection){
if (!err){
self.collection = collection;
Collection.prototype.onOpen.call(self);
}
});
};



NativeCollection.prototype.onClose = function () {
Collection.prototype.onClose.call(this);
};



for (var i in MongoCollection.prototype)
(function(i){
NativeCollection.prototype[i] = function () {

if (!this.buffer){
var collection = this.collection
, args = arguments
, self = this;

process.nextTick(function(){
collection[i].apply(collection, args);
});
} else
this.addQueue(i, arguments);
};
})(i);



NativeCollection.prototype.getIndexes = NativeCollection.prototype.indexInformation;



var oldEnsureIndex = MongoCollection.prototype.ensureIndex;

function noop () {};

MongoCollection.prototype.ensureIndex = function(fields, options, fn){
if (!this.buffer) {
return oldEnsureIndex.apply(this, arguments);
}
};



module.exports = NativeCollection;
