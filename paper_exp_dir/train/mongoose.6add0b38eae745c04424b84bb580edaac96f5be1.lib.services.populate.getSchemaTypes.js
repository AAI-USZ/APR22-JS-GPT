'use strict';



var Mixed = require('../../schema/mixed');
var mpath = require('mpath');



module.exports = function getSchemaTypes(schema, doc, path) {
const pathschema = schema.path(path);

if (pathschema) {
return pathschema;
}

function search(parts, schema, subdoc) {
let p = parts.length + 1;
let foundschema;
let trypath;

while (p--) {
trypath = parts.slice(0, p).join('.');
foundschema = schema.path(trypath);
if (foundschema) {
if (foundschema.caster) {

if (foundschema.caster instanceof Mixed) {
return foundschema.caster;
}

let schemas = null;
if (doc != null && foundschema.schema != null && foundschema.schema.discriminators != null) {
const discriminators = foundschema.schema.discriminators;
const discriminatorKeyPath = trypath + '.' +
foundschema.schema.options.discriminatorKey;
const keys = mpath.get(discriminatorKeyPath, subdoc) || [];
schemas = Object.keys(discriminators).
reduce(function(cur, discriminator) {
if (keys.indexOf(discriminator) !== -1) {
cur.push(discriminators[discriminator]);
}
return cur;
}, []);
}







if (p !== parts.length && foundschema.schema) {
let ret;
if (parts[p] === '$') {
if (p + 1 === parts.length) {

return foundschema;
}

ret = search(parts.slice(p + 1), schema, mpath.get(trypath, subdoc));
if (ret) {
ret.$isUnderneathDocArray = ret.$isUnderneathDocArray ||
!foundschema.schema.$isSingleNested;
}
return ret;
}

if (schemas != null && schemas.length > 0) {
ret = [];
for (var i = 0; i < schemas.length; ++i) {
let _ret = search(parts.slice(p), schemas[i], mpath.get(trypath, subdoc));
if (_ret != null) {
_ret.$isUnderneathDocArray = _ret.$isUnderneathDocArray ||
!foundschema.schema.$isSingleNested;
if (_ret.$isUnderneathDocArray) {
ret.$isUnderneathDocArray = true;
}
ret.push(_ret);
}
}
return ret;
} else {
ret = search(parts.slice(p), foundschema.schema, mpath.get(trypath, subdoc));

if (ret) {
ret.$isUnderneathDocArray = ret.$isUnderneathDocArray ||
!foundschema.schema.$isSingleNested;
}

return ret;
}
}
}

return foundschema;
}
}
}


const parts = path.split('.');
for (let i = 0; i < parts.length; ++i) {
if (parts[i] === '$') {

parts[i] = '0';
}
}
return search(parts, schema, doc);
};
