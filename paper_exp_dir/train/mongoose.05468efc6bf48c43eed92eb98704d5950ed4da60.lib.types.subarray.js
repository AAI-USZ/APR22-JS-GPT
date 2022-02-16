








Array.prototype._atomics;



Array.prototype._parent;



Array.prototype._cast = function (value) {
var cast = this._schema.caster.cast
, doc = this._parent;

return cast.call(null, value, doc);
};



Array.prototype._markModified = function (embeddedDoc, embeddedPath) {
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



Array.prototype._registerAtomic = function (op, val) {
var atomics = this._atomics
if (op === '$pullAll' || op === '$pushAll' || op === '$addToSet') {
atomics[op] || (atomics[op] = new _Array);
atomics[op] = atomics[op].concat(val);
} else if (op === '$pullDocs') {
var pullOp = atomics['$pull'] || (atomics['$pull'] = {})
, selector = pullOp['_id'] || (pullOp['_id'] = {'$in' : new _Array });
selector['$in'] = selector['$in'].concat(val);
} else {
atomics[op] = val;
}
this._markModified();
return this;
};



Array.prototype.__defineGetter__('doAtomics', function () {
return Object.keys(this._atomics).length;
});



var oldPush = Array.prototype.push;

Array.prototype.$push =
Array.prototype.push = function () {
var values = Array.prototype.map.call(arguments, this._cast, this)
, ret = oldPush.apply(this, values);



this._registerAtomic('$pushAll', values);

return ret;
};



Array.prototype.nonAtomicPush = function () {
var values = Array.prototype.map.call(arguments, this._cast, this)
, ret = oldPush.apply(this, values);

this._markModified();

return ret;
};



Array.prototype.$pushAll = function (value) {
var length = this.length;
this.nonAtomicPush.apply(this, value);

this._registerAtomic('$pushAll', this.slice(length));
return this;
};



Array.prototype.$pop = function () {
this._registerAtomic('$pop', 1);
return this.pop();
};



Array.prototype.$shift = function () {
this._registerAtomic('$pop', -1);
return this.shift();
};



Array.prototype.remove = function () {
var args = Array.prototype.map.call(arguments, this._cast, this);
if (args.length == 1)
this.$pull(args[0]);
else
this.$pullAll(args);
return args;
};



Array.prototype.pull =
Array.prototype.$pull = function () {
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
this._registerAtomic('$pullDocs', values.map( function (v) { return v._id; } ));
} else {
this._registerAtomic('$pullAll', values);
}

return this;
};



Array.prototype.$pullAll = function (values) {
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
if (values[0] instanceof EmbeddedDocument) {
this._registerAtomic('$pullDocs', values.map( function (v) { return v._id; } ));
} else {
this._registerAtomic('$pullAll', values);
}
}
return this;
};



var oldSplice = Array.prototype.splice;
Array.prototype.splice = function () {
oldSplice.apply(this, arguments);
this._markModified();
return this;
};



var oldUnshift = Array.prototype.unshift;
Array.prototype.unshift = function () {
var values = Array.prototype.map.call(arguments, this._cast, this);
oldUnshift.apply(this, values);
this._markModified();
return this.length;
};



Array.prototype.$addToSet =
Array.prototype.addToSet = function addToSet () {
var values = Array.prototype.map.call(arguments, this._cast, this)
, added = new _Array
, type = values[0] instanceof EmbeddedDocument ? 'doc' :
values[0] instanceof Date ? 'date' :
'';

values.forEach(function (v) {
var found;
switch (type) {
case 'doc':
found = this.some(function(doc){ return doc.equals(v) });
break;
case 'date':
var val = +v;
found = this.some(function(d){ return +d === val });
break;
default:
found = ~this.indexOf(v);
}

if (!found) {
oldPush.call(this, v);
this._registerAtomic('$addToSet', v);
oldPush.call(added, v);
}
}, this);

return added;
};



Array.prototype.toObject = function (options) {
if (options && options.depopulate && this[0] instanceof Document) {
return this.map(function (doc) {
return doc._id;
});
}

return this.map(function (doc) {
return doc;
});
};



Array.prototype.inspect = function () {
return '[' + this.map(function (doc) {
return ' ' + doc;
}) + ' ]';
};



Array.prototype.indexOf = function indexOf (obj) {
if (obj instanceof ObjectId) obj = obj.toString();
for (var i = 0, len = this.length; i < len; ++i) {
if (obj == this[i])
return i;
}
return -1;
};



exports = Array;
