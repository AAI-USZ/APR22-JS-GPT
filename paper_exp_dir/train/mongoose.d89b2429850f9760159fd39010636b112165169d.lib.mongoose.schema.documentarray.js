


var SchemaType = require('../schematype')
, ArrayType = require('./array')
, MongooseDocumentArray = require('../types/documentarray')
, Subdocument = require('../types/document')
, CastError = SchemaType.CastError
, Document = require('../document');



function DocumentArray (key, schema, options) {


function EmbeddedDocument () {
Subdocument.apply(this, arguments);
};

EmbeddedDocument.prototype.__proto__ = Subdocument.prototype;
EmbeddedDocument.prototype.schema = schema;
EmbeddedDocument.schema = schema;


for (var i in schema.methods) {
EmbeddedDocument.prototype[i] = schema.methods[i];
}


for (var i in schema.statics)
EmbeddedDocument[i] = schema.statics[i];

ArrayType.call(this, key, EmbeddedDocument, options);

this.caster = EmbeddedDocument;
this.caster.options = options;

var self = this;

this.schema = schema;
this.default(function(){
return new MongooseDocumentArray([], self.path, this);
});
};



DocumentArray.prototype.__proto__ = ArrayType.prototype;



DocumentArray.prototype.doValidate = function (array, fn, scope) {
var self = this;
SchemaType.prototype.doValidate.call(this, array, function(err){
if (err) return fn(err);

var count = array.length
, error = false;

if (!count) return fn();

array.forEach(function(doc, index){
doc.validate(function(err){
if (err && !error){

err.key = self.key + '.' + index + '.' + err.key;
fn(err);
error = true;
} else {
--count || fn();
}
});
});
}, scope);
};



DocumentArray.prototype.cast = function (value, doc, init) {
if (Array.isArray(value)) {
if (!(value instanceof MongooseDocumentArray))
value = new MongooseDocumentArray(value, this.path, doc);

for (var i = 0, l = value.length; i < l; i++) {
if (!(value[i] instanceof Subdocument)) {
var doc = new this.caster(null, value);

value[i] = init
? doc.init(value[i].doc || value[i])
: doc.set (value[i].doc || value[i]);
}
}

return value;
} else {
return this.cast([value], doc);
}

throw new CastError('documentarray', value);
};



module.exports = DocumentArray;
