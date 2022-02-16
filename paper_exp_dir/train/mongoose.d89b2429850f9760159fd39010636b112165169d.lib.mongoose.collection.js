


function Collection (name, conn) {
this.name = name;
this.conn = conn;
this.buffer = true;
this.queue = [];
if (this.conn.readyState == 1) this.onOpen();
};



Collection.prototype.name;



Collection.prototype.conn;



Collection.prototype.onOpen = function () {
var self = this;
this.buffer = false;
self.doQueue();
};



Collection.prototype.onClose = function () {
this.buffer = true;
};



Collection.prototype.addQueue = function (name, args) {
this.queue.push([name, args]);
return this;
};



Collection.prototype.doQueue = function () {
for (var i = 0, l = this.queue.length; i < l; i++){
this[this.queue[i][0]].apply(this, this.queue[i][1]);
}
this.queue = [];
return this;
};



Collection.prototype.ensureIndex = function(){
throw new Error('Collection#ensureIndex unimplemented by driver');
};



Collection.prototype.findAndModify = function(){
throw new Error('Collection#findAndModify unimplemented by driver');
};



Collection.prototype.findOne = function(){
throw new Error('Collection#findOne unimplemented by driver');
};



Collection.prototype.find = function(){
throw new Error('Collection#find unimplemented by driver');
};



Collection.prototype.insert = function(){
throw new Error('Collection#insert unimplemented by driver');
};



Collection.prototype.save = function(){
throw new Error('Collection#save unimplemented by driver');
};



Collection.prototype.update = function(){
throw new Error('Collection#update unimplemented by driver');
};



Collection.prototype.getIndexes = function(){
throw new Error('Collection#getIndexes unimplemented by driver');
};



module.exports = Collection;
