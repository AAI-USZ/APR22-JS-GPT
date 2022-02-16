'use strict';

const StrictModeError = require('../../error/strict');
const ValidationError = require('../../error/validation');
const getEmbeddedDiscriminatorPath = require('./getEmbeddedDiscriminatorPath');
const utils = require('../../utils');



module.exports = function castUpdate(schema, obj, options, context, filter) {
if (!obj) {
return undefined;
}

var ops = Object.keys(obj);
var i = ops.length;
var ret = {};
var hasKeys;
var val;
var hasDollarKey = false;
var overwrite = options.overwrite;

filter = filter || {};

while (i--) {
var op = ops[i];

if (op[0] !== '$' && !overwrite) {

if (!ret.$set) {
if (obj.$set) {
ret.$set = obj.$set;
} else {
ret.$set = {};
}
}
ret.$set[op] = obj[op];
ops.splice(i, 1);
if (!~ops.indexOf('$set')) ops.push('$set');
} else if (op === '$set') {
if (!ret.$set) {
ret[op] = obj[op];
}
} else {
ret[op] = obj[op];
}
}


i = ops.length;



if (overwrite) {
hasKeys = true;
}

while (i--) {
op = ops[i];
val = ret[op];
hasDollarKey = hasDollarKey || op.charAt(0) === '$';

if (val &&
typeof val === 'object' &&
!Buffer.isBuffer(val) &&
(!overwrite || hasDollarKey)) {
hasKeys |= walkUpdatePath(schema, val, op, options, context, filter);
} else if (overwrite && ret && typeof ret === 'object') {






walkUpdatePath(schema, ret, '$set', options, context, filter);
} else {
var msg = 'Invalid atomic update value for ' + op + '. '
+ 'Expected an object, received ' + typeof val;
throw new Error(msg);
}
}

return hasKeys && ret;
};



function walkUpdatePath(schema, obj, op, options, context, filter, pref) {
var strict = options.strict;
var prefix = pref ? pref + '.' : '';
var keys = Object.keys(obj);
var i = keys.length;
var hasKeys = false;
var schematype;
var key;
var val;

var aggregatedError = null;

var useNestedStrict = schema.options.useNestedStrict;

while (i--) {
key = keys[i];
val = obj[key];

if (val && val.constructor.name === 'Object') {

schematype = schema._getSchema(prefix + key);
if (schematype && schematype.caster && op in castOps) {

if ('$each' in val) {
hasKeys = true;
try {
obj[key] = {
$each: castUpdateVal(schematype, val.$each, op, context)
};
} catch (error) {
aggregatedError = _handleCastError(error, context, key, aggregatedError);
}

if (val.$slice != null) {
obj[key].$slice = val.$slice | 0;
}

if (val.$sort) {
obj[key].$sort = val.$sort;
}

if (!!val.$position || val.$position === 0) {
obj[key].$position = val.$position;
}
} else {
try {
obj[key] = castUpdateVal(schematype, val, op, context);
} catch (error) {
aggregatedError = _handleCastError(error, context, key, aggregatedError);
}

if (options.omitUndefined && obj[key] === void 0) {
delete obj[key];
continue;
}

hasKeys = true;
}
} else if ((op === '$currentDate') || (op in castOps && schematype)) {

try {
obj[key] = castUpdateVal(schematype, val, op, context);
} catch (error) {
aggregatedError = _handleCastError(error, context, key, aggregatedError);
}

if (options.omitUndefined && obj[key] === void 0) {
delete obj[key];
continue;
}

hasKeys = true;
} else {
var pathToCheck = (prefix + key);
var v = schema._getPathType(pathToCheck);
var _strict = strict;
if (useNestedStrict &&
v &&
v.schema &&
'strict' in v.schema.options) {
_strict = v.schema.options.strict;
}

if (v.pathType === 'undefined') {
if (_strict === 'throw') {
throw new StrictModeError(pathToCheck);
} else if (_strict) {
delete obj[key];
continue;
}
}




hasKeys |= walkUpdatePath(schema, val, op, options, context, filter, prefix + key) ||
(utils.isObject(val) && Object.keys(val).length === 0);
}
} else {
var checkPath = (key === '$each' || key === '$or' || key === '$and' || key === '$in') ?
pref : prefix + key;
schematype = schema._getSchema(checkPath);
var pathDetails = schema._getPathType(checkPath);


if (schematype == null) {
var _res = getEmbeddedDiscriminatorPath(schema, obj, filter, checkPath);
if (_res.schematype != null) {
schematype = _res.schematype;
pathDetails = _res.type;
}
}

var isStrict = strict;
if (useNestedStrict &&
pathDetails &&
pathDetails.schema &&
'strict' in pathDetails.schema.options) {
isStrict = pathDetails.schema.options.strict;
}

var skip = isStrict &&
!schematype &&
!/real|nested/.test(pathDetails.pathType);

if (skip) {
if (isStrict === 'throw') {
throw new StrictModeError(prefix + key);
} else {
delete obj[key];
}
} else {


if (op === '$rename') {
hasKeys = true;
continue;
}

try {
obj[key] = castUpdateVal(schematype, val, op, key, context);
} catch (error) {
aggregatedError = _handleCastError(error, context, key, aggregatedError);
}

if (Array.isArray(obj[key]) && (op === '$addToSet' || op === '$push') && key !== '$each') {
obj[key] = { $each: obj[key] };
}

if (options.omitUndefined && obj[key] === void 0) {
delete obj[key];
continue;
}

hasKeys = true;
}
}
}

if (aggregatedError != null) {
throw aggregatedError;
}

return hasKeys;
}



function _handleCastError(error, query, key, aggregatedError) {
if (typeof query !== 'object' || !query.options.multipleCastError) {
throw error;
}
aggregatedError = aggregatedError || new ValidationError();
aggregatedError.addError(key, error);
return aggregatedError;
}



var numberOps = {
$pop: 1,
$unset: 1,
$inc: 1
};



var castOps = {
$push: 1,
$addToSet: 1,
$set: 1,
$setOnInsert: 1
};



var overwriteOps = {
$set: 1,
$setOnInsert: 1
};



function castUpdateVal(schema, val, op, $conditional, context) {
if (!schema) {

return op in numberOps
? Number(val)
: val;
}

var cond = schema.caster && op in castOps &&
(utils.isObject(val) || Array.isArray(val));
if (cond && op !== '$set') {


var tmp = schema.cast(val);
if (Array.isArray(val)) {
val = tmp;
} else if (Array.isArray(tmp)) {
val = tmp[0];
} else {
val = tmp;
}
return val;
} else if (cond && op === '$set') {
return schema.cast(val);
}

if (op in numberOps) {
if (op === '$inc') {
return schema.castForQueryWrapper({ val: val, context: context });
}
return Number(val);
}
if (op === '$currentDate') {
if (typeof val === 'object') {
return {$type: val.$type};
}
return Boolean(val);
}

if (/^\$/.test($conditional)) {
return schema.castForQueryWrapper({
$conditional: $conditional,
val: val,
context: context
});
}

if (overwriteOps[op]) {
return schema.castForQueryWrapper({
val: val,
context: context,
$skipQueryCastForUpdate: val != null && schema.$isMongooseArray
});
}

return schema.castForQueryWrapper({ val: val, context: context });
}
