


var Document = require('../document')
, inspect = require('util').inspect;



function EmbeddedDocument (obj, parentArr) {
var self;

this.parentArray = parentArr;
this.parent = parentArr._parent;
Document.call(this, obj);

if (this.parent) {
self = this;
this.parent.on('save', function () {
self.isNew = false;
self.emit('save');
});
}
};



EmbeddedDocument.prototype.__proto__ = Document.prototype;



var oldSet = Document.prototype.set;

EmbeddedDocument.prototype.set = function (path) {
this.markModified(path);
return oldSet.apply(this, arguments);
};



EmbeddedDocument.prototype.commit =
EmbeddedDocument.prototype.markModified = function (path) {
this._activePaths.modify(path);

if (this.isNew) {



this.parentArray._markModified();
} else
this.parentArray._markModified(this, path);
};



EmbeddedDocument.prototype.save = function(fn) {
if (fn)
fn(null);
return this;
};



EmbeddedDocument.prototype.remove = function (fn) {
var _id;
if (!this.willRemove) {
_id = this._doc._id;
if (!_id) {
throw new Error('For your own good, Mongoose does not know ' +
'how to remove an EmbeddedDocument that has no _id');
}
this.parentArray.$pull({ _id: _id });
this.willRemove = true;
}

if (fn)
fn(null);

return this;
};



EmbeddedDocument.prototype.inspect = function () {
return inspect(this.toObject());
};



module.exports = EmbeddedDocument;
