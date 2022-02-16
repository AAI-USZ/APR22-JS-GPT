




module.exports = Collection;



function Collection(router) {
Array.apply(this, arguments);
Object.defineProperty(this, 'router', { value: router });
}



Collection.prototype.__proto__ = Array.prototype;



Collection.prototype.remove = function(){
var router = this.router
, len = this.length
, ret = new Collection(this.router);

for (var i = 0; i < len; ++i) {
if (router.remove(this[i])) {
ret.push(this[i]);
}
}

return ret;
};

