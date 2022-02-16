


var EmbeddedDocument = require('./document');
var ObjectId = require('./objectid');



function MongooseArray (values, path, doc) {
var arr = [];
arr.push.apply(arr, values);
arr.__proto__ = MongooseArray.prototype;

arr._atomics = {};
arr.validators = [];
arr._path = path;
arr._parent = doc;

if (doc) {
arr._schema = doc.schema.path(path);
}

return arr;
};



MongooseArray.prototype = new Array();



MongooseArray.prototype._atomics;



MongooseArray.prototype._parent;



MongooseArray.prototype._cast = function (value) {
var cast = this._schema.caster.cast
, doc = this._parent;

return cast.call(null, value, doc);
};



MongooseArray.prototype._markModified = function (embeddedDoc, embeddedPath) {
var parent = this._parent
, dirtyPath;

if (parent) {
if (arguments.length) {

dirtyPath = [this._path, this.indexOf(embeddedDoc), embeddedPath].join('.');
} else {
dirtyPath = this._path;
}
parent.markModified(dirtyPath);
}

return this;
};



MongooseArray.prototype._registerAtomic = function (op, val) {
var atomics = this._atomics
if (op === '$pullAll' || op === '$pushAll') {
atomics[op] || (atomics[op] = []);
atomics[op] = atomics[op].concat(val);
} else {
atomics[op] = val;
}
this._markModified();
return this;
};



MongooseArray.prototype.__defineGetter__('doAtomics', function () {
return Object.keys(this._atomics).length;
});



var oldPush = MongooseArray.prototype.push;

MongooseArray.prototype.$push =
MongooseArray.prototype.push = function () {
var values = Array.prototype.map.call(arguments, this._cast, this)
, ret = oldPush.apply(this, values);



this._registerAtomic('$pushAll', values);

return ret;
};



MongooseArray.prototype.nonAtomicPush = function () {
var self = this
, values = Array.prototype.map.call(arguments, this._cast, this)
, ret = oldPush.apply(this, values);

this._markModified();

return ret;
};



MongooseArray.prototype.$pushAll = function (value) {
var length = this.length;
this.nonAtomicPush.apply(this, value);

this._registerAtomic('$pushAll', this.slice(length));
return this;
};



MongooseArray.prototype.$pop = function () {
this._registerAtomic('$pop', 1);
return this.pop();
};



MongooseArray.prototype.$shift = function () {
this._registerAtomic('$pop', -1);
return this.shift();
};



MongooseArray.prototype.remove = function () {
var args = Array.prototype.map.call(arguments, this._cast, this);
if (args.length == 1)
this.$pull(args[0]);
else
this.$pullAll(args);
return args;
};



MongooseArray.prototype.pull =
MongooseArray.prototype.$pull = function () {
var values = Array.prototype.map.call(arguments, this._cast, this)
, oldArr = this._parent.get(this._path)
, i = oldArr.length
, mem;

while (i--) {
mem = oldArr[i];
if (mem instanceof EmbeddedDocument) {
if (values.some(function (v) { return v.equals(mem); } )) {
oldArr.splice(i, 1);
}
} else if (~values.indexOf(mem)) {
oldArr.splice(i, 1);
}
}

if (values[0] instanceof EmbeddedDocument) {
this._registerAtomic('$pullAll', values.map( function (v) { return {_id: v._id}; } ));
} else {
this._registerAtomic('$pullAll', values);
}

return this;
};



MongooseArray.prototype.$pullAll = function (values) {
if (values && values.length) {
var oldArr = this._parent.get(this._path)
, i = oldArr.length, mem;
while (i--) {
mem = oldArr[i];
if (mem instanceof EmbeddedDocument) {
if (values.some( function (v) { return v.equals(mem); } )) {
oldArr.splice(i, 1);
}
} else if (~values.indexOf(mem)) oldArr.splice(i, 1);
}
this._registerAtomic('$pullAll', values);
}
return this;
};



MongooseArray.prototype.splice = function () {
Array.prototype.splice.apply(this, arguments);
this._markModified();
return this;
};



MongooseArray.prototype.toObject = function () {
return this.map(function (doc) {
return doc;
});
};



MongooseArray.prototype.inspect = function () {
return '[' + this.map(function (doc) {
return ' ' + doc;
}) + ' ]';
};





MongooseArray.prototype.indexOf = function(obj){
if (obj instanceof ObjectId) obj = obj.toString();
for (var i = 0, len = this.length; i < len; ++i) {
if (obj == this[i])
return i;
}
return -1;
};



module.exports = MongooseArray;
