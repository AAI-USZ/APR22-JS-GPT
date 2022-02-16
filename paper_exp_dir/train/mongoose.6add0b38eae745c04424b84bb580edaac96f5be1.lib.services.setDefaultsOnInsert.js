'use strict';

var modifiedPaths = require('./common').modifiedPaths;



module.exports = function(filter, schema, castedDoc, options) {
var keys = Object.keys(castedDoc || {});
var updatedKeys = {};
var updatedValues = {};
var numKeys = keys.length;
var hasDollarUpdate = false;
var modified = {};

if (options && options.upsert) {
for (var i = 0; i < numKeys; ++i) {
if (keys[i].charAt(0) === '$') {
modifiedPaths(castedDoc[keys[i]], '', modified);
hasDollarUpdate = true;
}
}

if (!hasDollarUpdate) {
modifiedPaths(castedDoc, '', modified);
}

var paths = Object.keys(filter);
var numPaths = paths.length;
for (i = 0; i < numPaths; ++i) {
var path = paths[i];
var condition = filter[path];
if (condition && typeof condition === 'object') {
var conditionKeys = Object.keys(condition);
var numConditionKeys = conditionKeys.length;
var hasDollarKey = false;
for (var j = 0; j < numConditionKeys; ++j) {
if (conditionKeys[j].charAt(0) === '$') {
hasDollarKey = true;
break;
}
}
if (hasDollarKey) {
continue;
}
}
updatedKeys[path] = true;
modified[path] = true;
}

if (options && options.overwrite && !hasDollarUpdate) {


return castedDoc;
}

if (options.setDefaultsOnInsert) {
schema.eachPath(function(path, schemaType) {
if (schemaType.$isSingleNested) {


schemaType.schema.eachPath(function(_path, _schemaType) {
if (_path === '_id' && _schemaType.auto) {

return;
}

var def = _schemaType.getDefault(null, true);
if (!isModified(modified, path + '.' + _path) &&
typeof def !== 'undefined') {
castedDoc = castedDoc || {};
castedDoc.$setOnInsert = castedDoc.$setOnInsert || {};
castedDoc.$setOnInsert[path + '.' + _path] = def;
updatedValues[path + '.' + _path] = def;
}
});
} else {
var def = schemaType.getDefault(null, true);
if (!isModified(modified, path) && typeof def !== 'undefined') {
castedDoc = castedDoc || {};
castedDoc.$setOnInsert = castedDoc.$setOnInsert || {};
castedDoc.$setOnInsert[path] = def;
updatedValues[path] = def;
}
}
});
}
}

return castedDoc;
};

function isModified(modified, path) {
if (modified[path]) {
return true;
}
var sp = path.split('.');
var cur = sp[0];
for (var i = 0; i < sp.length; ++i) {
if (modified[cur]) {
return true;
}
cur += '.' + sp[i];
}
return false;
}
