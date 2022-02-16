var _ = require('underscore');

var Collection = function(arr){
if (arr){
var length = this.length = arr.length;

for (var i=0; i<length; i++){
this[i] = arr[i];
}
} else {
this.length = 0;
}
};

Collection.prototype.init = function(arr){
return new Collection(arr);
};

Collection.prototype.each = Collection.prototype.forEach = function(iterator){
for (var i=0, len=this.length; i<len; i++){
var _iterator = iterator(this[i], i);

if (typeof _iterator !== 'undefined'){
if (_iterator){
continue;
} else {
break;
}
}
}
};

Collection.prototype.map = function(iterator){
var arr = this.toArray();

this.each(function(item, i){
var _iterator = iterator(item, i);
if (typeof _iterator !== 'undefined') arr[i] = _iterator;
});

return this.init(arr);
};

Collection.prototype.filter = Collection.prototype.select = function(iterator){
var arr = [];

this.each(function(item, i){
var _iterator = iterator(item, i);
if (_iterator) arr.push(item);
});

return this.init(arr);
};

Collection.prototype.toArray = function(){
var result = [];

this.each(function(item){
result.push(item);
});

return result;
};

Collection.prototype.slice = function(start, end){
return this.init([].slice.apply(this.toArray(), arguments));
};

Collection.prototype.skip = function(num){
return this.slice(num);
};

Collection.prototype.limit = function(num){
return this.slice(0, num);
};

Collection.prototype.set = Collection.prototype.push = function(item){
this[this.length] = item;
this.length++;
};

Collection.prototype.sort = function(orderby, order){
var arr = this.toArray().sort(function(a, b){
return a[orderby] - b[orderby];
});

if (order){
order = order.toString();
if (order == -1 || order.toLowerCase() === 'desc') arr = arr.reverse();
}

return this.init(arr);
};

Collection.prototype.reverse = function(){
return this.init(this.toArray().reverse());
