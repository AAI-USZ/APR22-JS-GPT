'use strict';



const CastError = require('../error/cast');
const EventEmitter = require('events').EventEmitter;
const ObjectExpectedError = require('../error/objectExpected');
const SchemaType = require('../schematype');
const $exists = require('./operators/exists');
const castToNumber = require('./operators/helpers').castToNumber;
const discriminator = require('../helpers/model/discriminator');
const geospatial = require('./operators/geospatial');
const get = require('../helpers/get');
const getConstructor = require('../helpers/discriminator/getConstructor');
const internalToObjectOptions = require('../options').internalToObjectOptions;

let Subdocument;

module.exports = SingleNestedPath;



function SingleNestedPath(schema, path, options) {
this.caster = _createConstructor(schema);
this.caster.path = path;
this.caster.prototype.$basePath = path;
this.schema = schema;
this.$isSingleNested = true;
SchemaType.call(this, path, options, 'Embedded');
}



SingleNestedPath.prototype = Object.create(SchemaType.prototype);
SingleNestedPath.prototype.constructor = SingleNestedPath;



function _createConstructor(schema) {

Subdocument || (Subdocument = require('../types/subdocument'));

const _embedded = function SingleNested(value, path, parent) {
const _this = this;

this.$parent = parent;
Subdocument.apply(this, arguments);

this.$session(this.ownerDocument().$session());

if (parent) {
parent.on('save', function() {
_this.emit('save', _this);
_this.constructor.emit('save', _this);
});

parent.on('isNew', function(val) {
_this.isNew = val;
_this.emit('isNew', val);
_this.constructor.emit('isNew', val);
});
}
};
_embedded.prototype = Object.create(Subdocument.prototype);
_embedded.prototype.$__setSchema(schema);
_embedded.prototype.constructor = _embedded;
_embedded.schema = schema;
_embedded.$isSingleNested = true;
_embedded.events = new EventEmitter();
_embedded.prototype.toBSON = function() {
return this.toObject(internalToObjectOptions);
};


for (const i in schema.methods) {
_embedded.prototype[i] = schema.methods[i];
}


for (const i in schema.statics) {
_embedded[i] = schema.statics[i];
}

for (const i in EventEmitter.prototype) {
_embedded[i] = EventEmitter.prototype[i];
}

return _embedded;
}



SingleNestedPath.prototype.$conditionalHandlers.$geoWithin = function handle$geoWithin(val) {
return { $geometry: this.castForQuery(val.$geometry) };
};



SingleNestedPath.prototype.$conditionalHandlers.$near =
SingleNestedPath.prototype.$conditionalHandlers.$nearSphere = geospatial.cast$near;

SingleNestedPath.prototype.$conditionalHandlers.$within =
SingleNestedPath.prototype.$conditionalHandlers.$geoWithin = geospatial.cast$within;

SingleNestedPath.prototype.$conditionalHandlers.$geoIntersects =
