


var MongooseError = require('./error');
var utils = require('./utils');



function SchemaType (path, options) {
this.path = path;
this.validators = [];
this.setters = [];
this.getters = [];
this.options = options;
this._index = null;

for (var i in options) if (this[i] && 'function' == typeof this[i]) {
var opts = Array.isArray(options[i])
? options[i]
: [options[i]];

this[i].apply(this, opts);
}
};



SchemaType.prototype.base;



SchemaType.prototype.default = function (val) {
if (1 === arguments.length) {
this.defaultValue = typeof val === 'function'
? val
: this.cast(val);
return this;
} else if (arguments.length > 1) {
this.defaultValue = utils.args(arguments);
}
return this.defaultValue;
};



SchemaType.prototype.index = function (index) {
this._index = index;
return this;
};



SchemaType.prototype.unique = function (bool) {
if (!this._index || Object !== this._index.constructor) {
this._index = {};
}

this._index.unique = bool;
return this;
};



SchemaType.prototype.sparse = function (bool) {
if (!this._index || Object !== this._index.constructor) {
this._index = {};
}

this._index.sparse = bool;
return this;
};



SchemaType.prototype.set = function (fn) {
this.setters.push(fn);
return this;
};



SchemaType.prototype.get = function (fn) {
this.getters.push(fn);
return this;
};



SchemaType.prototype.validate = function (obj, error) {
this.validators.push([obj, error]);
return this;
};



SchemaType.prototype.required = function (required) {
var self = this;

function __checkRequired (v) {
return self.checkRequired(v);
}

if (false === required) {
this.isRequired = false;
this.validators = this.validators.filter(function (v) {
return v[0].name !== '__checkRequired';
});
} else {
this.isRequired = true;
this.validators.push([__checkRequired, 'required']);
}

return this;
};



SchemaType.prototype.getDefault = function (scope) {
var ret = 'function' === typeof this.defaultValue
? this.defaultValue.call(scope)
: this.defaultValue;

if (null !== ret && undefined !== ret) {
ret = this.cast(ret, scope);
}

return ret;
};



SchemaType.prototype.applySetters = function (value, scope, init) {
var v = value
, setters = this.setters
, len = setters.length;

for (var k = len - 1; k >= 0; k--) {
v = setters[k].call(scope, v);
if (null === v || undefined === v) return v;
v = this.cast(v, scope);
}

if (!len) {
if (null === v || undefined === v) return v;
if (!init) {

v = this.cast(v, scope, init);
}
}

return v;
};



SchemaType.prototype.applyGetters = function (value, scope) {
var v = value
, getters = this.getters
, len = getters.length;

for (var k = len - 1; k >= 0; k--){
v = this.getters[k].call(scope, v);
if (null === v || undefined === v) return v;
v = this.cast(v, scope);
}

if (!len) {
if (null === v || undefined === v) return v;
v = this.cast(v, scope);
}

return v;
};



SchemaType.prototype.doValidate = function (value, fn, scope) {
var err = false
, path = this.path
, count = this.validators.length;

if (!count) return fn(null);

function validate (val, msg) {
if (err) return;
if (val === undefined || val) {
--count || fn(null);
} else {
fn(new ValidatorError(path, msg));
err = true;
}
}

this.validators.forEach(function (v) {
var validator = v[0]
, message   = v[1];

if (validator instanceof RegExp) {
validate(validator.test(value), message);
} else if ('function' === typeof validator) {
if (2 === validator.length) {
validator.call(scope, value, function (val) {
validate(val, message);
});
} else {
validate(validator.call(scope, value), message);
}
}
});
};



function ValidatorError (path, type) {
var msg = type
? '"' + type + '" '
: '';
MongooseError.call(this, 'Validator ' + msg + 'failed for path ' + path);
Error.captureStackTrace(this, arguments.callee);
this.name = 'ValidatorError';
this.path = path;
this.type = type;
};

ValidatorError.prototype.toString = function() {
return this.message;
}



ValidatorError.prototype.__proto__ = MongooseError.prototype;



function CastError (type, value) {
MongooseError.call(this, 'Cast to ' + type + ' failed for value "' + value + '"');
Error.captureStackTrace(this, arguments.callee);
this.name = 'CastError';
this.type = type;
this.value = value;
};



CastError.prototype.__proto__ = MongooseError.prototype;



module.exports = exports = SchemaType;

exports.CastError = CastError;

exports.ValidatorError = ValidatorError;
