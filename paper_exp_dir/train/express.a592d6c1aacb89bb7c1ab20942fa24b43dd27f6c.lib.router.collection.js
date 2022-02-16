




module.exports = Collection;



function Collection(router) {
Object.defineProperty(this, 'router', { value: router });
}



Collection.prototype.__proto__ = Array.prototype;



Collection.prototype.remove = function(){
var router = this.router
, len = this.length
, ret = new Collection(this.router);

